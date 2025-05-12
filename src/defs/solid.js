

export const solids = (target, vals, enumerable=true)=>{
    for (const k in vals) {
        Object.defineProperty(target, k, { value:vals[k], enumerable });
    }
    return target;
}