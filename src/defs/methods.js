import Ł, { fail, getDefByInst } from "./base.js";

export const isFull = (any, isIterable)=>{
    if (!isIterable) { return (any === false || any === 0 || !!any); }
    for (let v of vals(any)) { if (v != null) { return true; }}
    return false;
}

export const touchBy = (any, op, throwError, ...args)=>{
    const type = getDefByInst(any, false)?.type;

    if (type?.isIterable) { return type[op](any, ...args); }
    if (!throwError) { return; }

    if (!type) { fail(`unable execute '${op}' - missing type of '${any}'`); }
    if (!type.isIterable) { fail(`undefined operation '${op}' - unavailable for this type`, type.name); }
}

//0 = full, 1 = only, 2 = tap, 3 = pull
export const factory = (type, mm, ...args)=>{
    for (const a of args) {
        if (!n) {
            const t = getDefByInst(a)?.type;
            if (type && type !== t) { continue; }
            if (mm === 0 && !(t ? t.isFull(a) : isFull(a))) { continue; }
            return (t && mm === 3) ? t.copy(a) : a;
        }
    }
    if (type && mm > 1) { return type.create(); }
}

export const getRnd = (arr, min, max, sqr)=>{ //get random element from array or string
    if (!arr) { return; }
    arr = Array.from(arr);
    const l = arr.length;
    return arr[Math.floor(Ł.num.rnd(Ł.num.frame(min||0, 0, l), Ł.num.frame(max||l, 0, l), sqr))];
};
