import jet, { throwError, throwWarn, register, getDefByConst, getDefByName } from "./defs.js";
import * as _ from "./methods.js";

const enumerable = true;

const define = (name, constructor, options={})=>{
    let { create, is, full, copy, rnd, keys, vals, entries, get, set, rem, to, plugins, extend, extendPrototype, extendConstructor } = options;

    if (getDefByName(name)) { throwError("is allready defined", name);}
    if (!constructor) { throwError("constructor missing", name); }
    if ((keys || vals || entries) && !(keys && vals && entries)) { throwError("keys, vals or entries missing", name); }

    const prototype = constructor.prototype;
    create = create || ((...a)=>new constructor(...a));
    copy = copy || (any=>any);

    let xc = extend !== false && extendConstructor !== false;
    let xp = extend !== false && extendPrototype !== false;
    if (xc || xp) {
        const ancestor = getDefByConst(constructor);
        if (ancestor) {
            throwWarn(`constructor allready extended as '${ancestor}'. Use option 'extend=false'`, name);
            xc = null;
            xp = null;
        } else {
            if (xc) { Object.defineProperty(constructor, "jet", { value:xc={} }); }
            if (xp) { xp = {}; Object.defineProperty(prototype, "jet", { get:function() { return {__:this, ...xp} } }); }
        }
    }

    const con = (s, key, fce)=>{
        const value = !s ? fce : (self, ...a)=>_.is(name, self) ? fce(self, ...a) : undefined;
        if (s && xp) { Object.defineProperty(xp, key, {enumerable, value:function(...a) { return fce(this.__, ...a); }}); }
        if (xc) { Object.defineProperty(xc, key, {enumerable, value}); }
        Object.defineProperty(jet[key], name, {enumerable, value});
    }

    con(false, "create", create);
    con(false, "is", (any, inclusive=false)=>_.is(name, any, inclusive));
    con(false, "to", (any, ...a)=>_.to(name, any, ...a));
    con(false, "only", (...a)=>_.factory(name, 0, ...a));
    con(false, "full", (...a)=>_.factory(name, 1, ...a));
    con(false, "tap", (...a)=>_.factory(name, 2, ...a));
    con(false, "pull", (...a)=>_.factory(name, 3, ...a));
    con(false, "rnd", rnd = rnd || create);

    con(true, "isFull", full = full || (any=>_.isFull(any, vals)));

    if (entries) {
        con(true, "keys", keys);
        con(true, "vals", vals);
        con(true, "entries", entries);           
        con(true, "get", get = (get || ((x, k)=>x[k])));
        con(true, "set", set = (set || ((x, k, v)=>x[k] = v)));
        con(true, "rem", rem = (rem || ((x, k)=>delete x[k])));
        con(true, "getRND", (any, min, max, sqr)=>_.getRND(vals(any), min, max, sqr));
    }
    
    register({ name, constructor, prototype, is, create, full, copy, rnd, keys, vals, entries, get, set, rem, to:{} });    
    _.toDefine(name, to);

    if ((xc || xp) && plugins) { for (const k in plugins) {
        const e = plugins[k], r = jet.isRunnable(e);
        if (xc) { Object.defineProperty(xc, k, {enumerable, value:!r ? e : (self, ...a)=>e(_.to(name, self), ...a)}); }
        if (r && xp) { Object.defineProperty(xp, k, {enumerable, value:function(...a) { return e(this.__, ...a); }}); }
    }}

    return constructor;
};

export default define;