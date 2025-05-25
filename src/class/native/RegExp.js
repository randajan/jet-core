import { anyToFn } from "@randajan/function-parser";
import { _str } from "./String";
import { rgxLib } from "../../defs/regex";
import { rgxToStr, strToRgx } from "@randajan/regex-parser";


export const _rgx = _str.extend("rgx", {
    self: RegExp,
    create: RegExp,
    copy: x => RegExp(x.source),
    from:rgx=>rgxToStr(rgx),
    to:str=>strToRgx(str)
}).defineFrom({
    //arr:, //rgx: (arr, comma) => new RegExp(arr.join(comma ?? "|")), //TODO
    //bol:,
    //dt:,
    //err:,
    //fn:,
    //map:,
    //num:,
    //obj:,
    //rgx:,
    //set:,
    //str:,
    //sym:
}).addTools({
    lib: rgxLib
})