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
        key:{enumerable, value:key},
        value:{enumerable, value},
        depth:{enumerable, value:parent.depth+1},
        pending:{enumerable, get:_=>parent.pending},
        stop:{enumerable, value:parent.stop},
        path:{enumerable, get:_=>[...(path || (path = collectPath(parent)))]},
        fullpath:{enumerable, get:_=>fullpath || (fullpath = [...ctx.path, key]) },
        def:{enumerable, get:_=>def || (def = getDefByInst(value))},
    });

    return ctx;
}

const _each = (any, parent, exe)=>{
    for (let [key, val] of parent.def.entries(any)) {
        const ctx = createContext(parent, key, val);
        if (ctx.pending) { exe(val, ctx); }
        if (!ctx.pending) { break; }
    };
}

export const each = (any, fce, options={})=>{
    if (!jet.isRunnable(fce)) { throw new Error(`fce expect an Function`); }
    const root = initContext(any, options.root);

    const deep = options.deep;
    const dprun = jet.isRunnable(deep);

    const exe = (val, ctx, isRoot)=>{
        const dp = ctx.def.entries;
        if (dp && dprun) { deep(val, ctx, _=>_each(val, ctx, exe)); }
        else if (dp && (deep || isRoot)) { _each(val, ctx, exe); }
        else { fce(val, ctx); }
    }
    
    exe(any, root, true);
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
        ctx.def.set(ctx.result, key, val);
    }

    each(any, (val, ctx)=>{
        val = fce(val, ctx);
        if (val !== undefined) { set(ctx.parent, ctx.key, val); }
    }, options);

    return result;
};
