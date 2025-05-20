import { anyToFn } from "@randajan/function-parser";
import { _str } from "./_String";
import { rgxLib } from "../../defs/regex";
import { rgxToStr, strToRgx } from "@randajan/regex-parser";


export const _rgx = _str.extend("rgx", {
    self: RegExp,
    create: RegExp,
    copy: x => RegExp(x.source),
    from:rgx=>rgxToStr(rgx),
    to:str=>strToRgx(str)
}).defineTo({
    arr:rgx=>[rgx],
    fn: anyToFn,
}).addTools({
    lib: rgxLib
})