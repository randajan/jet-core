import jet from "../";
import { createContext, fight, formatOrderBy, initContext } from "./each";


const _filter = async (entries, fce)=>{
    const res = [];

    await Promise.all(entries.map(async en=>{
        if (await fce(en[1], en[0])) { res.push(en); }
    }));

    return res;
}

const _refine = async (entries, { filter, orderBy })=>{
    if (!filter && !orderBy) { return entries; }
    entries = filter ? await _filter(entries, filter) : [...entries];

    if (!orderBy) { return entries; }

    const obs = formatOrderBy(orderBy);
    const expand = await Promise.all(entries.map(async ([key, value])=>[key, value, await Promise.all(obs.map(ob=>ob[0](value, key)))]));

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

const _each = async (parent, exe, options)=>{
    const entries = parent.def.entries(parent.value);
    const refined = !parent.isRoot ? entries : await _refine(entries, options);

    for (let [key, val] of refined) {
        const ctx = createContext(parent, key, val);
        if (ctx.pending) { await exe(ctx); } // it will wait for every single item before execute the next
        if (!ctx.pending) { break; }
    };
}

export const each = (any, fce, options={})=>{
    if (!jet.isRunnable(fce)) { throw new Error(`fce expect an Function`); }
    const root = initContext(any, options.root);
    
    const deep = options.deep;
    const dprun = jet.isRunnable(deep);
    root.result = options.init;

    const exe = async (ctx, skipDeep=false)=>{
        const de = ctx.def.entries;
        if (!de || (!deep && !ctx.isRoot)) { await fce(ctx.value, ctx); }
        else if (dprun && !skipDeep) { await deep(ctx.value, ctx, (...a)=>{ exe(ctx.update(...a), true) }); }
        else { await _each(ctx, exe, options); }
        return ctx.result;
    }
    
    return exe(root, true);
};


//implementation of each iterator

export const find = (any, fce, options={})=>{
    return each(any, async (val, ctx)=>{
        val = await fce(val, ctx);
        if (val !== undefined && ctx.stop()) { ctx.root.result = val; }
    }, options);
};

export const flat = (any, fce, options={})=>{
    if (!Array.isArray(options.init)) { options.init = []; }

    return each(any, async (val, ctx)=>{
        val = await fce(val, ctx);
        if (val !== undefined) { ctx.root.result.push(val); }
    }, options);
};

export const map = (any, fce, options={})=>{
    delete options.init;

    const set = (ctx, key, val)=>{
        if (!ctx) { return; }
        if (!ctx.result) { set(ctx.parent, ctx.key, ctx.result = ctx.def.create()); }

        if (!options.strictArray && ctx.def.name === "Array") { ctx.result.push(val); }
        else { ctx.def.set(ctx.result, key, val); }
    }

    return each(any, async (val, ctx)=>{
        val = await fce(val, ctx);
        if (val !== undefined) { set(ctx.parent, ctx.key, val); }
    }, options);
};
