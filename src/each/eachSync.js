import { getDefByInst } from "../defs/base.js";
import jet from "../";
import { createContext, fight, formatOrderBy, initContext } from "./each.js";

const _filter = (entries, fce)=>{
    const res = [];
    for (let en of entries) {
        if (fce(en[1], en[0])) { res.push(en); }
    }
    return res;
}

const _refine = (entries, { filter, orderBy })=>{
    if (!filter && !orderBy) { return entries; }
    entries = filter ? _filter(entries, filter) : [...entries];

    if (!orderBy) { return entries; }

    const obs = formatOrderBy(orderBy);
    const expand = entries.map(([key, value])=>[key, value, obs.map(ob=>ob[0](value, key))]);

    return expand.sort(([aK, aV, aO], [bK, bV, bO]) => {
        for (const k in obs) {
            const dir = fight(aO[k], bO[k]);
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

export const map = (any, fce, options={})=>{
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
