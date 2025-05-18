import { anyToFn } from "@randajan/function-parser";
import { bolRnd } from "../../defs/crypt";
import { _num } from "./_Number";

export const _bol = _num.extend("bol", {
    self:Boolean,
    create:Boolean,
    isFilled:_=>true,
    copy:bol=>bol,
    rand:bolRnd,
    from:bol=>+bol,
    to:num=>!!num,
}).defineTo({
    arr: bol => [bol],
    fn: anyToFn,
    str: bol => String(bol),
});

