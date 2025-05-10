import { jet }from "../";
import { createContext, fight, formatOrderBy, initContext } from "./each";

//options:
//init | any | this will be set as context.result at initialization, useful for reducers
//root | array | root path of the iteration if exist
//strictArray | true/false | true = keeps undefined/empty values at result arrays;
//stopable | true/false | true = iteration can be stopped via context.stop();
//deep | true/false/function | true = when reach the iterable property it will iterate it too or place here a function to do custom deep-iteration


const _filter = (entries, fce)=>{
    const res = [];

    entries.forEach(en=>{
        if (fce(en[1], en[0])) { res.push(en); }
    });

    return 
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

const _eachSerial = (parent, exe, options)=>{
    const entries = parent.type.entries(parent.value);
    const refined = !parent.isRoot ? entries : _refine(entries, options);

    for (let [key, val] of refined) {
        const ctx = createContext(parent, key, val);
        if (ctx.pending) { exe(ctx); } // it will wait for every single item before execute the next
        if (!ctx.pending) { break; }
    };
}

export const each = (any, fce, options={})=>{
    if (!jet.isRunnable(fce)) { throw new Error(`fce expect an Function`); }
    const root = initContext(any, options);
    
    const deep = options.deep;
    const dprun = jet.isRunnable(deep);

    const _each = _eachSerial;

    const exe = (ctx, skipDeep=false)=>{
        const de = ctx.type?.entries;
        if (!de || (!deep && !ctx.isRoot)) { fce(ctx.value, ctx); }
        else if (dprun && !skipDeep) { deep(ctx.value, ctx, (...a)=>{ exe(ctx.update(...a), true) }); }
        else { _each(ctx, exe, options); }
        return ctx.result;
    }
    
    return exe(root, true);
};


//implementation of each iterator

export const find = (any, fce, options={})=>{
    options.stopable = true;
    
    return each(any, (val, ctx)=>{
        val = fce(val, ctx);
        if (val !== undefined && ctx.pending) {
            ctx.root.result = val;
            ctx.stop();
        }
    }, options);
};

export const list = (any, fce, options={})=>{
    if (!Array.isArray(options.init)) { options.init = []; }

    return each(any, (val, ctx)=>{
        val = fce(val, ctx);
        if (val !== undefined && ctx.pending) { ctx.root.result.push(val); }
    }, options);
};

export const map = (any, fce, options={})=>{
    delete options.init;

    const set = (ctx, key, val)=>{
        if (!ctx) { return; }
        if (!ctx.result) { set(ctx.parent, ctx.key, ctx.result = ctx.type.create()); }

        if (!options.strictArray && ctx.type?.name === "arr") { ctx.result.push(val); }
        else { ctx.type.set(ctx.result, key, val); }
    }

    return each(any, (val, ctx)=>{
        val = fce(val, ctx);
        if (val !== undefined && ctx.pending) { set(ctx.parent, ctx.key, val); }
    }, options);
};
