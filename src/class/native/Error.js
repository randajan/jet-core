import { anyToFn } from "@randajan/function-parser";
import { define } from "../../defs/tools";
import { _str } from "./String";

export const _err = define("err", {
    self:Error,
    create:Error,
    primitive:"str",
    rnd:(...a)=>new Error(_str.rnd(...a)),
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