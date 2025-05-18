import { anyToFn } from "@randajan/function-parser";
import { _num } from "./_Number";


export const _date = _num.extend("date", {
    self:Date,
    create:x=>!x ? new Date() : new Date(x),
    copy:dt=>new Date(dt),
    isFilled:dt=>!isNaN(dt.getTime()),
    rand:(from, to)=>new Date(_num.rand((new Date(from)).getTime(), to ? (new Date(to)).getTime() : Date.now()*2)),
    from:dt => dt.getTime(),
    to:num=>{
        const dt = new Date();
        dt.setTime(num);
        return dt;
    }
}).defineTo({
    arr: dt => [dt],
    fn: anyToFn,
    str: dt => dt.toLocaleString(),
})