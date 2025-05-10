import { jet } from "../../defs";

jet.define("Set", {
    self: Set,
    copy: x => new Set(x),
    keys: x => [...x.keys()],
    vals: x => [...x.values()],
    entries: x => [...x.entries()],
    get: (x, k) => x.has(k) ? k : undefined,
    set: (x, k, v) => x.add(v) ? v : undefined,
    rem: (x, k) => x.delete(k),
}).defineTo({
    "*": set => Array.from(set),
    Function: set => _ => set,
    Boolean: set => !!set.size,
    Object: set => jet.merge(set),
    Promise: async set => set,
})