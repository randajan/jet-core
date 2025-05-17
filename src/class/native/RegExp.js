import { anyToFn } from "@randajan/function-parser";
import { _str } from "./String";
import { regexLib } from "../../defs/regex";

export const _rgx = _str.extend("rgx", {
    self: RegExp,
    create: RegExp,
    copy: x => RegExp(x.source),
}).defineTo({
    "*": rgx => rgx.source,
    arr:rgx=>[rgx],
    //bool,
    //date,
    //err,
    fn: anyToFn,
    //map,
    //num,
    //obj,
    //rgx,
    set:rgx=>new Set([rgx]),
    //str,
    sym: rgx => Symbol(rgx.source),
}).addTools({
    lib: regexLib
})