import { anyToFn } from "@randajan/function-parser";
import { Definition } from "../self/Definition";
import { isFilleds } from "../../defs/statics";


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
    fn: anyToFn,
    str: obj => JSON.stringify(obj),
}).addTools({
    filter,
    exclude: (obj, mask = []) => filter(obj, (v, k) => !mask.includes(k)),
    extract: (obj, mask = []) => filter(obj, (v, k) => mask.includes(k)),
})
