import { anyToFn } from "@randajan/function-parser";
import { Definition } from "../self/Definition";
import { json } from "../../extra/json";
import { isFilled } from "../../defs/statics";


const filter = (obj, callback) => {
    const r = {};
    for (let i in obj) { if (callback(obj[i], i)) { r[i] = obj[i]; } }
    return r;
}

export const _obj = Definition.createType("obj", {
    self: Object,
    create: Object,
    copy: x => Object.defineProperties({}, Object.getOwnPropertyDescriptors(x)),
    keys: x => Object.keys(x),
    values: x => Object.values(x),
    entries: x => Object.entries(x),
}).defineTo({
    arr: obj => Object.entries(obj),
    bool: obj => isFilled(obj),
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
}).addTools({
    filter,
    exclude: (obj, mask = []) => filter(obj, (v, k) => !mask.includes(k)),
    extract: (obj, mask = []) => filter(obj, (v, k) => mask.includes(k)),
})
