import { anyToFn } from "@randajan/function-parser";
import { Definition } from "../self/Definition";

export const _bool = Definition.createType("bool", {
    self:Boolean,
    create:Boolean,
    isFilled:_=>true,
    copy:bol=>bol,
    rand:(trueRatio=.5)=>Math.random() < trueRatio
}).defineTo({
    arr: bol => [bol],
    //bool,
    //date,
    err: bol=>new Error(String(bol)),
    fn: anyToFn,
    //map,
    num: bol => +bol,
    //obj,
    set: bol => new Set([bol]),
    str: bol => String(bol),
    sym: bol => Symbol(bol),
});

