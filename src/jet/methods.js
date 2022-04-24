import { throwError, getDefByName, getDefByInst } from "./defs.js";

const magic = ["only", "full", "tap", "pull", "is", "to", "copy", "rnd"];

export const isInstance = any=>{
    const t = typeof any;
    return any != null && (t === "function" || t === "object");
}
export const isInstanceOf = (constructor, any)=>any instanceof constructor; //is instance comparing

export const is = (name, any, strict=true)=>{
    if (!name) { return false; }
    const def = getDefByName(name);
    if (def) {
        if (any == null) { return false; }
        if (strict && any.__proto__ !== def.prototype) { return false; }
        if (!strict && !(any instanceof def.constructor)) { return false; }
        return !def.is || def.is(any);
    }
    const nt = typeof name;
    if (nt === "string") { return typeof any === name; }
    if (any == null || (nt !== "function" && nt !== "object")) { return false; }
    return strict ? any.constructor === name : any instanceof name;
}

export const isFull = (any, vals)=>{
    if (!vals) { return (any === false || any === 0 || !!any); }
    for (let v of vals(any)) { if (v != null) { return true; }}
    return false;
}


const _touch = (def, op, err, ...args)=>{
    if (def[op]) { return def[op](...args); }
    if (err) { throwError(`undefined operation '${op}' - unavailable for this type`, def.name); }
}
export const touch = (name, op, err, ...args)=>{
    const def = getDefByName(name);
    if (def) { return _touch(def, op, err, any, ...args); }
    if (err) { throwError(`unable execute '${op}' - type unknown`, name); }
}
export const touchBy = (any, op, err, ...args)=>{
    const def = getDefByInst(any, false);
    if (def) { return _touch(def, op, err, any, ...args); }
    if (err) { throwError(`unable execute '${op}' - missing type of '${any}'`); }
}

//0 = only, 1 = full, 2 = tap, 3 = pull
export const factory = (name, mm, ...args)=>{
    const def = getDefByName(name);
    const n = isInstance(name);

    if (n && mm > 0) { throwError(`unable execute '${magic[mm]}' - unavailable for plain constructors`); }
    if (name && !n && !def) { throwError(`unable execute '${magic[mm]}' - type unknown`, name); }
    if (!name && mm !== 1) { throwError(`unable execute '${magic[mm]}' - type missing`); }

    for (const a of args) {
        if (!n) {
            const at = getDefByInst(a);
            if ((!name || (at && at.name === name)) && (mm !== 1 || (at && at.full(a) || (!at && isFull(a))))) {
                return mm === 3 ? at.copy(a) : a;
            }
        }
        else if (isInstanceOf(name, a)) { return a; }
    }
    if (mm > 1) { return def.create(); }
}

export const to = (name, any, ...args)=>{
    const def = getDefByName(name);
    if (!def) { throwError(`unable execute 'to' - type unknown`, name); }
    const at = getDefByInst(any, false);
    if (!at) { return def.create(); }
    if (def.name === at.name) { return any; }
    const exe = at.to[name] || at.to["*"]; 
    return exe ? to(name, exe(any, ...args), ...args) : def.create(any);
}

export const toDefine = (from, to, exe)=>{
    const tt = typeof to;
    const def = getDefByName(from);
    if (!def) { throwError(`unable define 'to' - type unknown`, from); }
    const conv = def.to;
    if (tt === "function") { conv["*"] = to; }
    else if (tt === "object" && Array.isArray(to)) { for (let i in to) { conv[to[i]] = exe; } }
    else if (tt === "object") { for (let i in to) { conv[i] = to[i]; } }
    else { conv[to] = exe; }
}

export const getRND = (arr, min, max, sqr)=>{ //get random element from array or string
    if (!arr) { return; }
    arr = Array.from(arr);
    const l = arr.length;
    return arr[Math.floor(Number.jet.rnd(Number.jet.frame(min||0, 0, l), Number.jet.frame(max||l, 0, l), sqr))];
};