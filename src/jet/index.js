import Plex from "./Plex";
import jet, { getDefByInst, getDefByName, throwError } from "./defs.js";
import * as _ from "./methods.js";
import define from "./define.js";
import * as pile from "./pile.js";

Plex.extend(jet, {
    is:_.is,
    to:_.to,
    isFull:any=>{ const def = getDefByInst(any); return def ? def.full(any) : _.isFull(any); },
    isMapable:any=>{ const def = getDefByInst(any); return def ? !!def.entries : false; },
    isRunnable:any=>typeof any === "function",
    full:(...a)=>_.factory(null, 1, ...a),
    only:(name, ...a)=>_.factory(name, 0, ...a),
    tap:(name, ...a)=>_.factory(name, 2, ...a),
    pull:(name, ...a)=>_.factory(name, 3, ...a),
    create:(name, ...a)=>_.touch(name, "create", true, ...a),
    rnd:(name, ...a)=>_.touch(name, "rnd", true, ...a),
    copy:any=>_.touchBy(any, "copy"),
    keys:(any, throwError=false)=>_.touchBy(any, "keys", throwError) || [],
    vals:(any, throwError=false)=>_.touchBy(any, "vals", throwError) || [],
    entries:(any, throwError=false)=>_.touchBy(any, "entries", throwError) || [],
    get:(any, key, throwError=false)=>_.touchBy(any, "get", throwError, key),
    set:(any, key, val, throwError=false)=>_.touchBy(any, "set", throwError, key, val),
    rem:(any, key, throwError=true)=>_.touchBy(any, "rem", throwError, key),
    getRND:(any, min, max, sqr)=>{
        const def = getDefByInst(any);
        if (def.vals) { any = def.vals(any); } else if (typeof any !== "string") { return; }
        return _.getRND(any, min, max, sqr);
    },
    run:(any, ...args)=>{
        if (jet.isRunnable(any)) { return [any(...args)]; }
        return jet.map(any, f=>jet.run(f, ...args));
    },
    ...pile,
    define:new Plex(define, {to:_.toDefine})
});

jet.define("Plex", Plex, {
    copy:x=>Object.defineProperties({}, Object.getOwnPropertyDescriptors(x)),
    keys:x=>Object.keys(x),
    vals:x=>Object.values(x),
    entries:x=>Object.entries(x)
});

export default jet;