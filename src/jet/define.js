import { throwError, register, getDefByName, throwWarn, getDefByProto } from "./defs.js";
import * as _ from "./methods.js";


const accepts = [ "create", "is", "isFull", "copy", "rnd", "keys", "vals", "entries", "get", "set", "rem", "to", "extend" ];

const define = (name, constructor, options={})=>{
    if (getDefByName(name)) { throwError("is allready defined", name);}
    if (!constructor) { throwError("constructor missing", name); }

    let { create, is, isFull, copy, rnd, keys, vals, entries, get, set, rem, to, extend } = options;
    const unknownOptions = Object.keys(options).filter(opt => !accepts.includes(opt)); // validate options

    if (unknownOptions.length) { throwWarn(`unknown options appeared at definition. '${unknownOptions.join("', '")}'`, name); }
    if ((keys || vals || entries) && !(keys && vals && entries)) { throwError("keys, vals or entries missing", name); }

    const prototype = constructor.prototype;
    const ancestor = getDefByProto(prototype);
    create = create || ((...a)=>new constructor(...a));
    copy = copy || (any=>any);
    rnd = rnd || create;
    isFull = isFull || (any=>_.isFull(any, vals));

    if (entries) {
        get = get || ((x, k) => x[k]);
        set = set || ((x, k, v) => x[k] = v);
        rem = rem || ((x, k) => delete x[k]);
    }
    
    const def = { name, constructor, prototype, is, create, isFull, copy, rnd, keys, vals, entries, get, set, rem, to:{} };
    register(def);    
    _.defineTo(name, to);

    if (extend !== false) {
        if (ancestor) { throwWarn(`constructor allready extended as '${ancestor.name}'. Use option 'extend:false'`, name); }
        Object.defineProperty(constructor, "jet", { value:{}, writable:true });
        
        _.extend(def, {
            create,
            rnd,
            isFull,
            is: (any, strict = true) => _.is(name, any, strict),
            to: (any, ...a) => _.to(name, any, ...a),
            only: (...a) => _.factory(name, 0, ...a),
            full: (...a) => _.factory(name, 1, ...a),
            tap: (...a) => _.factory(name, 2, ...a),
            pull: (...a) => _.factory(name, 3, ...a)
        }, true);

        if (entries) {
            _.extend(def, {
                keys,
                vals,
                entries,
                get,
                set,
                rem,
                getRND: (any, min, max, sqr) => _.getRND(vals(any), min, max, sqr)
            }, true);
        }

        if (typeof extend === "object") { _.extend(def, extend); }
    }

    return constructor;
};

export default define;