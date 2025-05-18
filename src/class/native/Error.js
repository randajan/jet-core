import { anyToFn } from "@randajan/function-parser";
import { _str } from "./_String";

export const _err = _str.extend("err", {
    self:Error,
    create:Error,
    rand:(...a)=>new Error(_str.rand(...a)),
    from:err=>err.message,
    to:str=>new Error(str)
}).defineTo({
    arr: err => [err],
    fn: anyToFn,
    //obj: err => Object.defineProperties({}, Object.getOwnPropertyDescriptors(err))
});