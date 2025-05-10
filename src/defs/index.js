import types, { jet, getDefByInst, getDefByName } from "./base.js";
import * as _ from "./methods.js";
import * as pile from "./extra/pile.js";
import * as dot from "./extra/dot.js";
import { solids } from "@randajan/props";
import { Definition } from "../class/self/Definition.js";

solids(jet, {
    is:(name, any, strict=true)=>{
        const def = getDefByName(name);
        if (def) { return def.type.is(any, strict); }

        const nt = typeof name;
        if (nt === "string") { return typeof any === name; }
        if (any == null || (nt !== "function" && nt !== "object")) { return false; }
        return any.constructor === name && (!strict || any instanceof name);
    },
    isFull:any=>{ const def = getDefByInst(any, false); return def ? def.type.isFull(any) : _.isFull(any); },
    isIterable:(any, strict=true)=>getDefByInst(any, strict)?.type.isIterable,
    isRunnable:any=>typeof any === "function",
    full:(...a)=>_.factory(null, 1, ...a),
    only:(name, ...a)=>_.factory(name, 0, ...a),
    tap:(name, ...a)=>_.factory(name, 2, ...a),
    pull:(name, ...a)=>_.factory(name, 3, ...a),
    create:(name, ...a)=>_.touch(name, "create", true, ...a),
    rnd:(name, ...a)=>_.touch(name, "rnd", true, ...a),
    keys:(any, throwError=false)=>_.touchBy(any, "keys", throwError) || [],
    vals:(any, throwError=false)=>_.touchBy(any, "vals", throwError) || [],
    entries:(any, throwError=false)=>_.touchBy(any, "entries", throwError) || [],
    get:(any, key, throwError=false)=>_.touchBy(any, "get", throwError, key),
    set:(any, key, val, throwError=false)=>_.touchBy(any, "set", throwError, key, val),
    rem:(any, key, throwError=true)=>_.touchBy(any, "rem", throwError, key),
    getRnd:(any, min, max, sqr)=>{
        const def = getDefByInst(any);
        if (def?.type.isIterable) { any = def.type.vals(any); }
        else if (typeof any !== "string") { return; }
        return _.getRnd(any, min, max, sqr);
    },
    ...pile,
    dot,
    define:(name, definition)=>Definition.create(name, definition).type
});

export default types;
export {
    jet
}