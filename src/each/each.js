import { getDefByInst } from "../defs/base.js";
import Ł, { jet }from "../";

const enumerable = true;

export const initContext = (value, {root, stopable, init})=>{
    let path, type, brk, onStop;

    const ctx = Object.defineProperties({}, {
        isRoot:{enumerable, value:true},
        root:{get:_=>ctx},
        value:{enumerable, value},
        depth:{enumerable, value:!root ? 0 : root.length},
        pending:{enumerable, get:_=>!brk},
        path:{enumerable, get:_=>path != null ? path : (path = jet.dot.toString(root)) },
        fullpath:{enumerable, get:_=>ctx.path },
        type:{enumerable, get:_=>type || (type = getDefByInst(value)?.type)}
    });

    ctx.result = init;

    return !stopable ? ctx : Object.defineProperties(ctx, {
        stop:{ value:_=>{
            if (brk) { return false; }
            brk = true;
            if (onStop) { for (const f of onStop) { f(ctx); } }
            return true;
        }},
        onStop:{ value:cb=>{
            if (!onStop) { onStop = [cb]; }
            else { onStop.push(cb); }
        } }
    });

}


export const createContext = (parent, key, value)=>{
    let type, fullpath;

    const ctx = Object.defineProperties({}, {
        isRoot:{enumerable, value:false},
        root:{value:parent.root},
        parent:{value:parent},
        key:{enumerable, get:_=>key, set:k=>{ key = k; fullpath = undefined; }},
        value:{enumerable, get:_=>value, set:v=>{ value = v; type = undefined; }},
        depth:{enumerable, value:parent.depth+1},
        pending:{enumerable, get:_=>parent.pending},
        stop:{enumerable, value:parent.stop},
        path:{enumerable, get:_=>parent.fullpath},
        fullpath:{enumerable, get:_=>fullpath || (fullpath = jet.dot.glue(ctx.path, jet.dot.escape(key))) },
        type:{enumerable, get:_=>type || (type = getDefByInst(value)?.type)},
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
    if (typeof a === "string" || typeof b === "string") { return a === Ł.str.fight(a, b); }
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