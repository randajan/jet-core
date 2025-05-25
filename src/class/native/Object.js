import { anyToFn } from "@randajan/function-parser";
import { Definition } from "../self/Definition";
import { errToObj, strToObj, symToStr } from "../../defs/convert";


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
}).defineFrom({
    //arr,
    //fn,
    //num,
    //obj,
    str:strToObj,
    //bol,
    //dt,
    err:errToObj,
    map:v=>Object.fromEntries(v.entries()),
    //rgx,
    //set,
    sym:v=>strToObj(symToStr(v))
}).addTools({
    filter,
    exclude: (obj, mask = []) => filter(obj, (v, k) => !mask.includes(k)),
    extract: (obj, mask = []) => filter(obj, (v, k) => mask.includes(k)),
})
