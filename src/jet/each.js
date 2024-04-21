import jet, { getDefByInst } from "./defs.js";


const enumerable = true;
const initContext = (value, root)=>{
    let def, brk;

    if (root == null) { root = []; }
    else if (!Array.isArray(root)) { throw new Error(`argument root expect an Array`); }

    const ctx = Object.defineProperties({}, {
        isRoot:{enumerable, value:true},
        root:{get:_=>ctx},
        value:{enumerable, value},
        depth:{enumerable, get:_=>root.length},
        pending:{enumerable, get:_=>!brk},
        stop:{enumerable, value:_=>brk ? false : (brk = true)},
        path:{enumerable, get:_=>!root.length ? [] : [...root] },
        fullpath:{enumerable, get:_=>ctx.path },
        def:{enumerable, get:_=>def || (def = getDefByInst(value))},
    });

    return ctx;
}

const collectPath = parent=>{
    let rpath = [], p = parent;
    while (true) {
        if (!p.parent) {
            const path = rpath.reverse();
            return !p.depth ? path : [...p.path, ...path];
        }
        rpath.push(p.key);
        p = p.parent;
    }
}

const createContext = (parent, key, value)=>{
    let def, path, fullpath;

    const ctx = Object.defineProperties({}, {
        isRoot:{enumerable, value:false},
        root:{value:parent.root},
        parent:{value:parent},
        key:{enumerable, get:_=>key, set:k=>{ key = k; fullpath = undefined; }},
        value:{enumerable, get:_=>value, set:v=>{ value = v; def = undefined; }},
        depth:{enumerable, value:parent.depth+1},
        pending:{enumerable, get:_=>parent.pending},
        stop:{enumerable, value:parent.stop},
        path:{enumerable, get:_=>[...(path || (path = collectPath(parent)))]},
        fullpath:{enumerable, get:_=>fullpath || (fullpath = [...ctx.path, key]) },
        def:{enumerable, get:_=>def || (def = getDefByInst(value))},
        update:{enumerable, value:(...a)=>{
            if (a.length > 0) { ctx.value = a[0]; }
            if (a.length > 1) { ctx.key = a[1]; }
            return ctx;
        }}
    });

    return ctx;
}

const _fight = (a, b)=>{
    if (a == b) { return; }
    if (a == null) { return true; } else if (b == null) { return false; }
    if (typeof a === "string" || typeof b === "string") { return a === String.jet.fight(a, b); }
    if (isNaN(a)) { return true; } else if (isNaN(b)) { return false; }
    return a < b;
}

const _filter = (entries, fce)=>{
    const res = [];
    for (let en of entries) {
        if (fce(en[1], en[0])) { res.push(en); }
    }
    return res;
}

const formatOrderBy = (orderBy)=>{
    if (!Array.isArray(orderBy)) { return [[orderBy, true]]; }
    const obs = [];
    for (let i=0; i<orderBy.length; i++) {
        const ob = orderBy[i];
        if (Array.isArray(ob)) { obs.push(ob); continue; }
        if (!jet.isRunnable(ob)) { continue; }
        const asc = (typeof orderBy[i+1] === "boolean") ? orderBy[i = i+1] : true;
        obs.push([ob, asc]);
    }
    return obs;
}

const _refine = (entries, { filter, orderBy })=>{
    if (!filter && !orderBy) { return entries; }
    entries = filter ? _filter(entries, filter) : [...entries];

    if (!orderBy) { return entries; }

    const obs = formatOrderBy(orderBy);
    const expand = entries.map(([key, value])=>[key, value, obs.map(ob=>ob[0](value, key))]);

    return expand.sort(([aK, aV, aO], [bK, bV, bO]) => {
        for (const k in obs) {
            const dir = _fight(aO[k], bO[k]);
            if (dir == null) { continue; }
            const asc = obs[k][1];
            return (asc == null ? !dir : dir != asc) * 2 - 1;
        }
        return 0;
    });

}

const _each = (entries, parent, exe)=>{
    for (let [key, val] of entries) {
        const ctx = createContext(parent, key, val);
        if (ctx.pending) { exe(ctx); }
        if (!ctx.pending) { break; }
    };
}

export const each = (any, fce, options={})=>{
    if (!jet.isRunnable(fce)) { throw new Error(`fce expect an Function`); }
    const root = initContext(any, options.root);
    
    const deep = options.deep;
    const dprun = jet.isRunnable(deep);

    const exe = (ctx, skipDeep=false)=>{
        const de = ctx.def.entries;
        if (!de || (!deep && !ctx.isRoot)) { fce(ctx.value, ctx); }
        else if (dprun && !skipDeep) { deep(ctx.value, ctx, (...a)=>exe(ctx.update(...a), true)); }
        else { _each(ctx.isRoot ? _refine(de(ctx.value), options) : de(ctx.value), ctx, exe); }
    }
    
    exe(root, true);
};


//implementation of each iterator


export const reduce = (any, fce, options={})=>{
    let result = options.init;

    each(any, (val, ctx)=>{ result = fce(result, val, ctx); }, options);

    return result;
}

export const find = (any, fce, options={})=>{
    let result;

    each(any, (val, ctx)=>{
        val = fce(val, ctx);
        if (val !== undefined && ctx.stop()) { result = val; }
    }, options);

    return result;
};

export const flat = (any, fce, options={})=>{
    const result = Array.isArray(options.init) ? result : [];

    each(any, (val, ctx)=>{
        val = fce(val, ctx);
        if (val !== undefined) { result.push(val); }
    }, options);

    return result;
};

export const remap = (any, fce, options={})=>{
    let result;

    const set = (ctx, key, val)=>{
        if (!ctx) { return; }
        if (!ctx.result) {
            set(ctx.parent, ctx.key, ctx.result = ctx.def.create());
            if (!result && ctx.isRoot) { result = ctx.result; }
        }

        if (!options.strictArray && ctx.def.name === "Array") { ctx.result.push(val); }
        else { ctx.def.set(ctx.result, key, val); }
        
    }

    each(any, (val, ctx)=>{
        val = fce(val, ctx);
        if (val !== undefined) { set(ctx.parent, ctx.key, val); }
    }, options);

    return result;
};
