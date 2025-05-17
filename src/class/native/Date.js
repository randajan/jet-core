import { anyToFn } from "@randajan/function-parser";
import { Definition } from "../self/Definition";
import { _num } from "./Number";

export const _date = Definition.createType("date", {
    self:Date,
    create:x=>!x ? new Date() : new Date(x),
    copy:dt=>new Date(dt),
    isFilled:dt=>!isNaN(dt.getTime()),
    rand:(from, to)=>new Date(_num.rand((new Date(from)).getTime(), to ? (new Date(to)).getTime() : Date.now()*2))
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