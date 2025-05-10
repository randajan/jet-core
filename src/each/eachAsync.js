import { jet }from "../";
import { createContext, fight, formatOrderBy, initContext } from "./each";

//options:
//init | any | this will be set as context.result at initialization, useful for reducers
//root | array | root path of the iteration if exist
//strictArray | true/false | true = keeps undefined/empty values at result arrays;
//paralelAwait | true/false | true = async iteration will proceed as paralel;
//stopable | true/false | true = iteration can be stopped via context.stop();
//deep | true/false/function | true = when reach the iterable property it will iterate it too or place here a function to do custom deep-iteration


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

const _eachSerial = async (parent, exe, options)=>{
    const entries = parent.type.entries(parent.value);
    const refined = !parent.isRoot ? entries : await _refine(entries, options);

    for (let [key, val] of refined) {
        const ctx = createContext(parent, key, val);
        if (ctx.pending) { await exe(ctx); } // it will wait for every single item before execute the next
        if (!ctx.pending) { break; }
    };
}

const _eachParalel = async (parent, exe, options, stopProm)=>{
    const entries = parent.type.entries(parent.value);
    const refined = !parent.isRoot ? entries : await _refine(entries, options);

    const result = Promise.all(refined.map(async ([key, val])=>{
        const ctx = createContext(parent, key, val);
        if (ctx.pending) { await exe(ctx); }
    }));

    if (!stopProm) { await result; }
    else { await Promise.race([result, stopProm]); }

}

export const each = (any, fce, options={})=>{
    if (!jet.isRunnable(fce)) { throw new Error(`fce expect an Function`); }
    const root = initContext(any, options);
    
    const deep = options.deep;
    const dprun = jet.isRunnable(deep);

    const _each = !options.paralelAwait ? _eachSerial : _eachParalel;
    const stopProm = (!options.paralelAwait || !options.stopable) ? undefined : new Promise(res=>{ root.onStop(res); });

    const exe = async (ctx, skipDeep=false)=>{
        const de = ctx.type.entries; //TODO entries will be defined everytime
        if (!de || (!deep && !ctx.isRoot)) { await fce(ctx.value, ctx); }
        else if (dprun && !skipDeep) { await deep(ctx.value, ctx, (...a)=>{ exe(ctx.update(...a), true) }); }
        else { await _each(ctx, exe, options, stopProm); }
        return ctx.result;
    }
    
    return exe(root, true);
};


//implementation of each iterator

export const find = (any, fce, options={})=>{
    options.stopable = true;

    return each(any, async (val, ctx)=>{
        val = await fce(val, ctx);
        if (val !== undefined && ctx.pending) {
            ctx.root.result = val;
            ctx.stop();
        }
    }, options);
};

export const list = (any, fce, options={})=>{
    if (!Array.isArray(options.init)) { options.init = []; }

    return each(any, async (val, ctx)=>{
        val = await fce(val, ctx);
        if (val !== undefined && ctx.pending) { ctx.root.result.push(val); }
    }, options);
};

export const map = (any, fce, options={})=>{
    delete options.init;

    const set = (ctx, key, val)=>{
        if (!ctx) { return; }
        if (!ctx.result) { set(ctx.parent, ctx.key, ctx.result = ctx.type.create()); }

        if (!options.strictArray && ctx.type.name === "Array") { ctx.result.push(val); }
        else { ctx.type.set(ctx.result, key, val); }
    }

    return each(any, async (val, ctx)=>{
        val = await fce(val, ctx);
        if (val !== undefined && ctx.pending) { set(ctx.parent, ctx.key, val); }
    }, options);
};
