import jet, { getDefByInst } from "./defs.js";

const _each = (any, fce, deep, dprun, dir, flat)=>{
    const df = getDefByInst(any);
    if (!df || !df.entries) { return flat || any; }

    const res = flat || df.create();
    
    for (let [key, val] of df.entries(any)) {
        const path = (dir ? dir+"." : "")+key;
        const dp = deep && jet.isMapable(val);

        if (!dp) { val = fce(val, path, dir, key); }
        else if (dprun) { val = deep(val, path, dir, key); }
        else { val =_each(val, fce, deep, dprun, path, flat); }

        if (val === undefined) { continue; }
        if (!flat) { df.set(res, key, val); } else if (!dp) { flat.push(val); } //aftermath
    };
    
    return res;
}
const _eachInit = (any, fce, deep, dir, flat)=>_each(
    any,
    Function.jet.tap(fce),
    deep,
    jet.isRunnable(deep),
    String.jet.to(dir, "."),
    flat
);

export const forEach = (any, fce, deep, dir)=>_eachInit(any, fce, deep, dir, []);
export const map = (any, fce, deep, dir)=>_eachInit(any, fce, deep, dir);

export const reducer = reductor=>{
    let i=0, next;
    return next = (...input)=>reductor(next, i++, ...input);
}

export const dig = (any, path, fce)=>{
    const pa = String.jet.to(path, ".").split(".");
    const end = pa.length-1;
    return reducer((next, index, parent)=>{
        const dir = pa.slice(0, index).join(".");
        return fce(next, parent, (dir ? dir+"." : "") + pa[index], dir, pa[index], index === end);
    })(any);
}

export const digOut = (any, path, def)=>{
    const pa = String.jet.to(path, ".").split(".");
    for (let p of pa) { if (null == (any = jet.get(any, p, false))) { return def; }}
    return any;
};

export const digIn = (any, path, val, force=true, reductor=undefined)=>{

    const step = (next, parent, path, dir, key, isEnd)=>{
        let df = getDefByInst(parent);
        if (!df || !df.entries) {
            if (!force) { return parent; }
            parent = String.jet.isNumeric(key) ? [] : {};
            df = getDefByInst(parent);
        }
        const v = isEnd ? val : next(df.get(parent, key, false));
        if (v != null) { df.set(parent, key, v, false); return parent; }
        df.rem(parent, key);
        if (df.full(parent)) { return parent; }
    };

    return dig(any, path, !jet.isRunnable(reductor) ? step : 
        (next, parent, path, dir, key, isEnd)=>reductor(
            parent=>step(next, parent, path, dir, key, isEnd),
            parent, path, dir, key, isEnd
        )
    );

}

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
        digIn(r, "to."+e, flat[e], true);
    }
    return r.to;
};

 const _assign = (overwriteArray, to, ...any)=>{
    const r = {to};
    const flat = deflate(r.to, true);
    const add = (v,p)=>{ r.to = digIn(r.to, p, v); }
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