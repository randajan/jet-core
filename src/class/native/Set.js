import { define } from "../../defs/tools";

export const _set = define("set", {
    self: Set,
    primitive:"arr",
    copy: x => new Set(x),
    keys: x => [...x.keys()],
    values: x => [...x.values()],
    entries: x => [...x.entries()],
    get: (x, k) => x.has(k) ? k : undefined,
    set: (x, k, v) => x.add(v) ? v : undefined,
    rem: (x, k) => x.delete(k),
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