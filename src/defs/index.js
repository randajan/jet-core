import types, { jet, getDefByInst, getDefByName } from "./base.js";
import * as _ from "./methods.js";
import * as pile from "./extra/pile.js";
import * as dot from "./extra/dot.js";
import { solids } from "@randajan/props";
import { TypeInterface } from "../class/self/TypeInterface.js";

solids(jet, {
    is:(name, any, strict=true)=>{
        const type = getDefByName(name);
        if (type) { return type.is(any, strict); }

        const nt = typeof name;
        if (nt === "string") { return typeof any === name; }
        if (any == null || (nt !== "function" && nt !== "object")) { return false; }
        return any.constructor === name && (!strict || any instanceof name);
    },
    isFull:any=>{ const type = getDefByInst(any, false); return type ? type.isFull(any) : _.isFull(any); },
    isMapable:(any, strict=true)=>getDefByInst(any, strict)?.isMapable,
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
        const type = getDefByInst(any);
        if (type && type.isMapable) { any = type.vals(any); }
        else if (typeof any !== "string") { return; }
        return _.getRnd(any, min, max, sqr);
    },
    ...pile,
    dot,
    define:(name, definition)=>new TypeInterface(name, definition)
});

export default types;
export {
    jet
}