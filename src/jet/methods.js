import { throwError, getDefByName, getDefByInst, getNameByInst } from "./defs.js";

const magic = ["only", "full", "tap", "pull", "is", "to", "copy", "rnd"];

export const isInstance = any=>{
    const t = typeof any;
    return any != null && (t === "function" || t === "object");
}
export const isInstanceOf = (constructor, any)=>any instanceof constructor; //is instance comparing

export const is = (name, any, inclusive=false)=>{
    if (!name) { return false; }
    const def = getDefByName(name);
    if (def) {
        if (any == null || any.constructor !== def.constructor) { return false; }
        return inclusive || name === getNameByInst(any);
    }
    const nt = typeof name;
    if (nt === "string") { return typeof any === name; }
    if (any == null || (nt !== "function" && nt !== "object")) { return false; }
    return inclusive ? any instanceof name : any.constructor === name;
}

export const isFull = (any, vals)=>{
    if (!vals) { return (any === false || any === 0 || !!any); }
    for (let v of vals(any)) { if (v != null) { return true; }}
    return false;
}

export const touch = (name, op, ...args)=>{
    const def = getDefByName(name);
    if (!def) { throwError(`unable execute '${op}' - type unknown`, name); }
    if (!def[op]) { throwError(`undefined operation '${op}' - unavailable for this type`, name); }
    return def[op](...args);
}
export const touchBy = (any, op, ...args)=>{
    const name = getNameByInst(any);
    if (!name) { throwError(`unable execute '${op}' - missing type of '${any}'`); }
    return touch(name, op, any, ...args);
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
    const at = getDefByInst(any);
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