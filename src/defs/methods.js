import { fail, getDefByName, getDefByInst } from "./base.js";

const _magic = ["only", "full", "tap", "pull", "is", "to", "copy", "rnd"];

export const isInstance = any=>{
    const t = typeof any;
    return any != null && (t === "function" || t === "object");
}
export const isInstanceOf = (constructor, any)=>any instanceof constructor; //is instance comparing

export const isFull = (any, vals)=>{
    if (!vals) { return (any === false || any === 0 || !!any); }
    for (let v of vals(any)) { if (v != null) { return true; }}
    return false;
}


const _touch = (type, op, err, ...args)=>{
    if (type[op]) { return type[op](...args); }
    if (err) { fail(`undefined operation '${op}' - unavailable for this type`, type.name); }
}
export const touch = (name, op, err, ...args)=>{
    const type = getDefByName(name);
    if (type) { return _touch(type, op, err, ...args); }
    if (err) { fail(`unable execute '${op}' - type unknown`, name); }
}
export const touchBy = (any, op, err, ...args)=>{
    const type = getDefByInst(any, false);
    if (type) { return _touch(type, op, err, any, ...args); }
    if (err) { fail(`unable execute '${op}' - missing type of '${any}'`); }
}

//0 = only, 1 = full, 2 = tap, 3 = pull
export const factory = (name, mm, ...args)=>{
    const type = getDefByName(name);
    const n = isInstance(name);

    if (n && mm > 0) { fail(`unable execute '${_magic[mm]}' - unavailable for plain constructors`); }
    if (name && !n && !type) { fail(`unable execute '${_magic[mm]}' - type unknown`, name); }
    if (!name && mm !== 1) { fail(`unable execute '${_magic[mm]}' - type missing`); }

    for (const a of args) {
        if (!n) {
            const at = getDefByInst(a);
            if ((!name || (at && at.name === name)) && (mm !== 1 || (at && at.isFull(a) || (!at && isFull(a))))) {
                return mm === 3 ? at.copy(a) : a;
            }
        }
        else if (isInstanceOf(name, a)) { return a; }
    }
    if (mm > 1) { return type.create(); }
}

export const getRnd = (arr, min, max, sqr)=>{ //get random element from array or string
    if (!arr) { return; }
    arr = Array.from(arr);
    const l = arr.length;
    return arr[Math.floor(Number.jet.rnd(Number.jet.frame(min||0, 0, l), Number.jet.frame(max||l, 0, l), sqr))];
};
