import { jet } from "../../defs";

jet.define("set", {
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
    fn: set => _ => set,
    bool: set => !!set.size,
    obj: set => jet.merge(set),
    prom: async set => set,
})