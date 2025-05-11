import { anyToFn } from "@randajan/function-parser";
import { define } from "../../defs/tools";

export const _bool = define("bool", {
    self:Boolean,
    create:Boolean,
    rnd:(trueRatio=.5)=>Math.random() < trueRatio
}).defineTo({
    arr: bol => [bol],
    //bool,
    //date,
    err: bol=>new Error(String(bol)),
    fn: anyToFn,
    //map,
    num: bol => +bol,
    //obj,
    prom: async bol => bol,
    set: bol => new Set([bol]),
    str: bol => String(bol),
    sym: bol => Symbol(bol),
});

