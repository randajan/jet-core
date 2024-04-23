import { getDefByInst } from "../defs/base.js";
import jet from "../";

const enumerable = true;
export const initContext = (value, root)=>{
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

export const collectPath = parent=>{
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

export const createContext = (parent, key, value)=>{
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

export const fight = (a, b)=>{
    if (a == b) { return; }
    if (a == null) { return true; } else if (b == null) { return false; }
    if (typeof a === "string" || typeof b === "string") { return a === String.jet.fight(a, b); }
    if (isNaN(a)) { return true; } else if (isNaN(b)) { return false; }
    return a < b;
}

export const formatOrderBy = (orderBy)=>{
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