import jet, { throwError, throwWarn, register, getDefByProto, getDefByName } from "./defs.js";
import * as _ from "./methods.js";

const enumerable = true;

const define = (name, constructor, options={})=>{
    let { create, is, full, copy, rnd, keys, vals, entries, get, set, rem, to, extend, extendPrototype, extendConstructor } = options;

    if (getDefByName(name)) { throwError("is allready defined", name);}
    if (!constructor) { throwError("constructor missing", name); }
    if ((keys || vals || entries) && !(keys && vals && entries)) { throwError("keys, vals or entries missing", name); }

    const prototype = constructor.prototype;
    create = create || ((...a)=>new constructor(...a));
    copy = copy || (any=>any);

    const ec = extendConstructor === false ? null : typeof extendConstructor === "object" ? extendConstructor : {};
    const ep = extendPrototype === false ? null : typeof extendPrototype === "object" ? extendPrototype : {};
    let jc, jp;

    if (extend !== false) {
        const ancestor = getDefByProto(prototype);
        if (ancestor) {
            throwWarn(`constructor allready extended as '${ancestor}'. Use option 'extend=false'`, name);
        } else {
            if (ec) { Object.defineProperty(constructor, "jet", { value:jc={} }); }
            if (ep) { jp = {}; Object.defineProperty(prototype, "jet", { get:function() { return {__:this, ...jp} } }); }
        }
    }

    const ex = (pnw, key, fce)=>{
        if (pnw && jp) { Object.defineProperty(jp, key, {enumerable, value:pnw < 2 ? fce : function(...a) { return fce(this.__, ...a); }}); }
        if (jc) { Object.defineProperty(jc, key, {enumerable, value:fce}); }
        if (jet[key]) { Object.defineProperty(jet[key], name, {enumerable, value:fce}); }
    }

    ex(0, "create", create);
    ex(0, "is", (any, strict=true)=>_.is(name, any, strict));
    ex(0, "to", (any, ...a)=>_.to(name, any, ...a));
    ex(0, "only", (...a)=>_.factory(name, 0, ...a));
    ex(0, "full", (...a)=>_.factory(name, 1, ...a));
    ex(0, "tap", (...a)=>_.factory(name, 2, ...a));
    ex(0, "pull", (...a)=>_.factory(name, 3, ...a));
    ex(0, "rnd", rnd = rnd || create);

    ex(2, "isFull", full = full || (any=>_.isFull(any, vals)));

    if (entries) {
        ex(2, "keys", keys);
        ex(2, "vals", vals);
        ex(2, "entries", entries);           
        ex(2, "get", get = (get || ((x, k)=>x[k])));
        ex(2, "set", set = (set || ((x, k, v)=>x[k] = v)));
        ex(2, "rem", rem = (rem || ((x, k)=>delete x[k])));
        ex(2, "getRND", (any, min, max, sqr)=>_.getRND(vals(any), min, max, sqr));
    }
    
    register({ name, constructor, prototype, is, create, full, copy, rnd, keys, vals, entries, get, set, rem, to:{} });    
    _.toDefine(name, to);

    if (jc) { for (const k in ec) { ex(0, k, ec[k]); } }
    if (jp) { for (const k in ep) { ex(jet.isRunnable(ep[k]) ? 2 : 1, k, ep[k]); } }

    return constructor;
};

export default define;