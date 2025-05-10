import { jet } from "../../defs";

jet.define("wmap", {
    self: WeakMap,
    copy: x => new WeakMap(),
    get: (x, k) => x.get(k),
    set: (x, k, v) => x.set(k, v),
    rem: (x, k) => x.delete(k),
}).defineTo({
    fn: map => _ => map
})