import { anyToFn } from "@randajan/function-parser";
import { Definition } from "../self/Definition";
import { _str } from "./String";

export const _err = Definition.createType("err", {
    self:Error,
    create:Error,
    rand:(...a)=>new Error(_str.rand(...a)),
}).defineTo({
    "*": err=>err.message,
    arr: err => [err],
    //bool,
    //date,
    //err,
    fn: anyToFn,
    //map,
    //num,
    //obj,
    set: err => new Set([err]),
    //str,
    sym: err => Symbol(err.message),
});