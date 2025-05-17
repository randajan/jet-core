import { _arr } from "./Array";

export const _set = _arr.extend("set", {
    self: Set,
    isFilled: x=>!!x.size,
    copy: x => new Set(x),
    keys: x => [...x.keys()],
    values: x => [...x.values()],
    entries: x => [...x.entries()],
    get: (x, k) => x.has(k) ? k : undefined,
    set: (x, k, v) => x.add(v) ? v : undefined,
    del: (x, k) => x.del(k),
}).defineTo({
    "*": set => [...set],
    //arr,
    bool: set => !!set.size,
    //date,
    //err,
    //fn,
    map: set => new Map(set.entries()),
    num: set => set.size,
    obj: set => Object.fromEntries(set.entries()),
    //set,
    str: set => String(set),
    sym: set => Symbol(set),
})