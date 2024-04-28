import { getDefByInst } from "../defs/base.js";
import jet from "../defs";


const each = (any, fce, deep, init)=>{
    let isPending = true;
    const stop = _=>{ isPending = false; }

    const dprun = jet.isRunnable(deep);

    const exe = (ctx, skipDeep=false)=>{
        const { parent, path, def } = ctx;
        const de = def.entries;

        if (!de || (!deep && parent)) { fce(ctx); }
        else if (dprun && !skipDeep) { deep(ctx, _=>{ exe(ctx, true); }); }
        else {
            for (let [key, val] of de(ctx.val)) {
                exe({
                    parent:ctx, val, key, stop, def:getDefByInst(val),
                    path:(path ? path+"." : "") + String.jet.dotEscape(String(key)),
                });
                if (!isPending) { break; }
            };
        }

        return ctx.result;
    }

    const ctx = { val:any, stop, def:getDefByInst(any) };
    if (init) { init(ctx); }
    return exe(ctx, true);
};

export const reducer = reductor=>{
    let i=0, next;
    return next = (...input)=>reductor(next, i++, ...input);
}

export const dig = (any, path, reductor)=>{
    if (!Array.isArray(path)) { path = String.jet.dotSplit(String.jet.to(path)); }

    const end = path.length-1;
    return reducer((next, index, parent)=>{
        return reductor(next, parent, path[index], index === end);
    })(any);
}

export const digOut = (any, path, def)=>{
    if (!Array.isArray(path)) { path = String.jet.dotSplit(String.jet.to(path)); }
    if (!path.length) { return any; }

    for (let p of path) { if (null == (any = jet.get(any, p, false))) { return def; }}
    return any;
};

export const digIn = (any, path, val, force=true)=>{

    const step = (next, parent, key, isEnd)=>{
        let df = getDefByInst(parent);
        if (!df || !df.entries) {
            if (!force) { return parent; }
            parent = String.jet.isNumeric(key) ? [] : {};
            df = getDefByInst(parent);
        }
        const v = isEnd ? val : next(df.get(parent, key, false));
        if (v != null) { df.set(parent, key, v, false); return parent; }
        df.rem(parent, key);
        if (df.isFull(parent)) { return parent; }
    };

    return dig(any, path, step);
}

export const deflate = (any, includeMapable=false)=>{
    const flat = {};
    const add = ({ val, path }, next)=>{
        flat[path] = val;
        if (next) { next(); }
    };
    each(any, add, includeMapable ? add : true);
    if (includeMapable) { flat[""] = any; }
    return flat;
}

export const inflate = (flat, includeMapable=true)=>{
    const r = {};
    for (const e of Object.keys(flat).sort()) {
        if (!includeMapable && jet.isMapable(flat[e])) { continue; }
        digIn(r, "to."+e, flat[e], true);
    }
    return r.to;
};

 const _assign = (overwriteArray, to, ...any)=>{
    const flat = deflate(to, true);

    const add = ({ val, path })=>{ to = digIn(to, path, val); }
    const acumulate = ({ val, path, def }, next)=>{
        if (!flat[path]) { add(flat[path] = def.create(), path); }
        if (Array.isArray(val) && Array.isArray(flat[path])) { flat[path].push(...val); }
        else { next(val); }
    }

    for (const a of any) { each(a, add, !!overwriteArray || acumulate); }

    return to;
};

export const assign = (to, from, overwriteArray=true)=>_assign(overwriteArray, to, from);
export const merge = (...any)=>_assign(false, {}, ...any);

export const compare = (a, b, diffList=false)=>{
    if (a === b) { return changeList ? [] : true; }

    const res = [];
    const flat = deflate(a);

    each(b, ({ val, path, stop })=>{
        if (flat[path] !== val) { res.push(path); }
        delete flat[path];
        if (!diffList && res.length) { stop(); }
    }, true);

    for (let path in flat) {
        if (!diffList && res.length) { break; }
        res.push(path);
    }

    return diffList ? res : !res.length;
}

export const copy = (any, deep=false, copyUnmapable=false)=>{
    return each(any, ctx=>{
        const { parent, val, key, def } = ctx;
        if (!parent) { return; }
        parent.def.set(parent.result, key, ctx.result = copyUnmapable ? def.copy(val) : val);
    }, !deep ? false : (ctx, next)=>{
        const { parent, key, def } = ctx;
        parent.def.set(parent.result, key, ctx.result = def.create());
        next();
    }, ctx=>{
        const { val, def } = ctx;
        ctx.result = def.entries ? def.create() : def.copy(val);
    });
}

export const melt = (any, comma)=>{
    let j = "", c = String.jet.to(comma);
    if (!jet.isMapable(any)) { return String.jet.to(any, c); }
    each(any, ({ val })=>{
        val = String.jet.to(val, c);
        if (val) { j += (j?c:"")+val; }
    }, true);
    return j;
}

export const run = (any, ...args)=>{
    if (jet.isRunnable(any)) { return any(...args); }
    if (!jet.isMapable(any)) { return undefined; }
    const res = [];
    each(any, ({val})=>{ res.push(jet.isRunnable(val) ? val(...args) : undefined); }, true);
    return res;
}

export const enumFactory = (enums, {before, after, def}={})=>(raw, ...args)=>{
    const input = before ? before(raw, ...args) : raw;
    const output = enums.includes(input) ? input : def;
    
    return after ? after(output, ...args) : output;
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