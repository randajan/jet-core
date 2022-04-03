import jet, { getDefByInst } from "./defs.js";

const _forKey = (any, key)=>jet.isMapable(any) ? any : String.jet.isNumeric(key) ? [] : {};
const _each = (any, fce, deep, flat, path)=>{
    const def = getDefByInst(any);
    flat = flat ? Array.jet.tap(flat) : null;
    if (!def || !def.entries) { return flat || any; }

    fce = Function.jet.tap(fce);
    path = String.jet.to(path, ".");
    const deeprun = jet.isRunnable(deep);
    const res = flat || def.create();
    
    for (let [key, val] of def.entries(any)) {
        const pkey = (path ? path+"." : "")+key;
        const dp = deep && jet.isMapable(val);
        val = !dp ? fce(val, pkey, any, path) : deeprun ? deep(val, pkey, any, path) : _each(val, fce, deep, flat, pkey);
        if (val === undefined) { continue; }
        if (!flat) { def.set(res, key, val); } else if (!dp) { flat.push(val); } //aftermath
    };
    
    return res;
}

export const forEach = (any, fce, deep, path)=>_each(any, fce, deep, true, path);
export const map = (any, fce, deep, path)=>_each(any, fce, deep, false, path);

export const dig = (any, path, def)=>{
    const pa = String.jet.to(path, ".").split(".");
    for (let p of pa) { if (null == (any = jet.get(any, p))) { return def; }}
    return any;
};

export const put = (any, path, val, force=true)=>{
    const pa = String.jet.to(path, ".").split("."), pb = [];
    const r = any = _forKey(any, pa[0]);

    for (let [i, p] of pa.entries()) {
        if (val == null) { pb[pa.length-1-i] = [any, p]; } //backpath
        if (!force && any[p] != null && !jet.isMapable(any[p])) { return r; }
        else if (i !== pa.length-1) { any = jet.set(any, p, _forKey(any[p], pa[i+1]));}
        else if (val == null) { jet.rem(any, p);}
        else { jet.set(any, p, val);}
    };

    for (let [any, p] of pb) {
        if (jet.isFull(any[p])) { break; }
        else { jet.rem(any, p); }
    };
    return r;
};

export const deflate = (any, includeMapable=false)=>{
    const flat = {};
    const add = (v,p)=>{ flat[p] = v; };
    const deep = (v,p)=>{ add(v,p); forEach(v, add, deep, p); };
    forEach(any, add, includeMapable ? deep : true);
    return flat;
}

export const inflate = (flat, includeMapable=true)=>{
    const r = {};
    for (const e of jet.keys(flat).sort()) {
        if (!includeMapable && jet.isMapable(flat[e])) { continue; }
        put(r, "to."+e, flat[e], true);
    }
    return r.to;
};

 const _assign = (overwriteArray, to, ...any)=>{
    const r = {to};
    const flat = deflate(r.to, true);
    const add = (v,p)=>{ r.to = put(r.to, p, v); }
    const acumulate = (v,p)=>{
        if (!flat[p]) { add(flat[p] = getDefByInst(v).create(), p); }
        if (Array.isArray(v) && Array.isArray(flat[p])) { flat[p].push(...v); }
        else { forEach(v, add, acumulate, p); }
    }
    for (const a of any) { forEach(a, add, !!overwriteArray || acumulate); }
    return r.to;
};

export const assign = (to, from, overwriteArray=true)=>_assign(overwriteArray, to, from);
export const merge = (...any)=>_assign(false, {}, ...any);

export const clone = (any, deep)=>map(any, _=>_, deep);

// const _audit = (includeMapable, ...any)=>{
//     const audit = new Set();
//     any.map(a=>forEach(a, (v,p)=>audit.add(p), includeMapable ? (v,p)=>audit.add(p) : true));
//     return Array.from(audit).sort((a,b)=>b.localeCompare(a));
// }
// export const auditKeys = (...any)=>_audit(true, ...any);
// export const auditVals = (...any)=>_audit(false, ...any);

// export const match = (to, from, fce)=>{
//     fce = Function.jet.tap(fce);
//     auditVals(to, from).map(path=>{
//         put(to, path, fce(dig(to, path), dig(from, path), path), true);
//     });
//     return to;
// };

// export const compare = (...any)=>{
//     const res = new Set();
//     auditKeys(...any).map(path=>{
//         if (new Set(any.map(a=>dig(a, path))).size > 1) {
//             const parr = path.split(".");
//             parr.map((v,k)=>res.add(parr.slice(0, k+1).join(".")));
//         }
//     })
//     return Array.from(res);
// };

export const melt = (any, comma)=>{
    let j = "", c = String.jet.to(comma);
    if (!jet.isMapable(any)) { return String.jet.to(any, c); }
    forEach(any, v=>{ v = melt(v, c); j += v ? (j?c:"")+v : "";});
    return j;
}

export const prop = {
    add: (obj, property, val, writable=false, enumerable=false, overwrite=true)=>{ 
        if (jet.isMapable(property)) {
            forEach(property, (f, i)=>{
                const n = String.jet.isNumeric(i);
                prop.add(obj, n ? f : i, n ? val : f, writable, enumerable, overwrite)
            });
        } else if (!obj[property] || overwrite) {
            Object.defineProperty(obj, property, { value:val, writable, configurable:writable, enumerable });
        }
        return obj;
    },
    get: (obj, property)=>{
        if (!property) { property = Array.from(Object.getOwnPropertyNames(obj)); }
        if (!jet.isMapable(property)) { return obj[property]; }
        const props = {};
        forEach(property, k=>props[k]=obj[k]);
        return props;
    }
}

export const json = {
    from: (json, throwErr=false)=>{
        if (jet.isMapable(json)) { return json; }
        try { return JSON.parse(String.jet.to(json)); } catch(e) { if (throwErr === true) { throw e } }
    },
    to: (obj, prettyPrint=false)=>{
        const spacing = Number.jet.only(prettyPrint === true ? 2 : prettyPrint);
        return JSON.stringify(jet.isMapable(obj) ? obj : {}, null, spacing);
    }
}