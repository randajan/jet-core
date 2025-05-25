import { anyToFn } from "@randajan/function-parser";
import { _str } from "./String";

export const _err = _str.extend("err", {
    self:Error,
    create:Error,
    rand:(...a)=>new Error(_str.rand(...a)),
    from:err=>err.message,
    to:str=>new Error(str)
}).defineFrom({
    //arr:, //err: (arr, comma) => arr.join(comma ?? " "),
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
})