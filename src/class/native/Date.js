import { anyToFn } from "@randajan/function-parser";
import { define } from "../../defs/tools";
import { _num } from "./Number";

export const _date = define("date", {
    self:Date,
    create:x=>!x ? new Date() : new Date(x),
    rnd:(from, to)=>new Date(_num.rnd((new Date(from)).getTime(), to ? (new Date(to)).getTime() : Date.now()*2))
}).defineTo({
    arr: dt => [dt],
    //bool,
    //date,
    //err,
    fn: anyToFn,
    //map,
    num: dt => dt.getTime(),
    //obj,
    set: dt => new Set([dt]),
    str: dt => dt.toLocaleString(),
    sym: dt => Symbol(dt.toLocaleString()),
})