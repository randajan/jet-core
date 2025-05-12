import { anyToFn } from "@randajan/function-parser";
import { define } from "../../defs/tools";

import { json } from "../../extra/json";

const filter = (obj, callback) => {
    const r = {};
    for (let i in obj) { if (callback(obj[i], i)) { r[i] = obj[i]; } }
    return r;
}

export const _obj = define("obj", {
    self: Object,
    create: Object,
    copy: x => Object.defineProperties({}, Object.getOwnPropertyDescriptors(x)),
    keys: x => Object.keys(x),
    values: x => Object.values(x),
    entries: x => Object.entries(x),
}).defineTo({
    arr: obj => Object.entries(obj),
    bool: obj => _obj.isFull(obj),
    //date,
    err: obj => json.to(obj),
    fn: anyToFn,
    map: obj => new Map(Object.entries(obj)),
    num: obj => Object.values(obj),
    //obj,
    rgx: (obj, comma) => Array.from(Object.values(obj)).join(comma ?? "|"),
    set: obj => new Set(Object.values(obj)),
    str: obj => json.to(obj),
    sym: obj => Symbol(json.to(obj)),
}).extend({
    filter,
    exclude: (obj, mask = []) => filter(obj, (v, k) => !mask.includes(k)),
    extract: (obj, mask = []) => filter(obj, (v, k) => mask.includes(k)),
})
