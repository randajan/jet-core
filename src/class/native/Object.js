import { jet } from "../../defs";

const filter = (obj, callback) => {
    const r = {};
    for (let i in obj) { if (callback(obj[i], i)) { r[i] = obj[i]; } }
    return r;
}

jet.define("Object", {
    self: Object,
    create: Object,
    copy: x => Object.defineProperties({}, Object.getOwnPropertyDescriptors(x)),
    keys: x => Object.keys(x),
    vals: x => Object.values(x),
    entries: x => Object.entries(x),
}).defineTo({
    Function: obj => _ => obj,
    Symbol: obj => Symbol(jet.json.to(obj)),
    Boolean: obj => jet.isFull.Object(obj),
    Number: obj => Object.values(obj),
    Array: obj => Object.values(obj),
    String: obj => (obj.toString && obj.toString !== Object.prototype.toString) ? obj.toString() : jet.json.to(obj),
    Promise: async obj => obj,
    Error: obj => jet.json.to(obj),
    RegExp: (obj, comma) => jet.melt(obj, comma != null ? comma : "|")
}).extend({
    filter,
    exclude: (obj, mask = []) => filter(obj, (v, k) => !mask.includes(k)),
    extract: (obj, mask = []) => filter(obj, (v, k) => mask.includes(k)),
})
