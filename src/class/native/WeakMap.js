import { jet } from "../../defs";

jet.define("WeakMap", {
    self: WeakMap,
    copy: x => new WeakMap(),
    get: (x, k) => x.get(k),
    set: (x, k, v) => x.set(k, v),
    rem: (x, k) => x.delete(k),
}).defineTo({
    Function: map => _ => map
})