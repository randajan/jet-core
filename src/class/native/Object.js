import { jet } from "../../defs";

const filter = (obj, callback) => {
    const r = {};
    for (let i in obj) { if (callback(obj[i], i)) { r[i] = obj[i]; } }
    return r;
}

jet.define("obj", {
    self: Object,
    create: Object,
    copy: x => Object.defineProperties({}, Object.getOwnPropertyDescriptors(x)),
    keys: x => Object.keys(x),
    vals: x => Object.values(x),
    entries: x => Object.entries(x),
}).defineTo({
    fn: obj => _ => obj,
    sym: obj => Symbol(jet.json.to(obj)),
    bool: obj => jet.isFull.Object(obj),
    num: obj => Object.values(obj),
    arr: obj => Object.values(obj),
    str: obj => (obj.toString && obj.toString !== Object.prototype.toString) ? obj.toString() : jet.json.to(obj),
    prom: async obj => obj,
    err: obj => jet.json.to(obj),
    rgx: (obj, comma) => jet.melt(obj, comma != null ? comma : "|")
}).extend({
    filter,
    exclude: (obj, mask = []) => filter(obj, (v, k) => !mask.includes(k)),
    extract: (obj, mask = []) => filter(obj, (v, k) => mask.includes(k)),
})
