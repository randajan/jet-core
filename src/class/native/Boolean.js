import { anyToFn } from "@randajan/function-parser";
import { bolRnd } from "../../defs/crypt";
import { Definition } from "../self/Definition";
import { strToBol, symToStr } from "../../defs/convert";
import { isFilleds } from "../../defs/statics";



export const _bol = Definition.createType("bol", {
    self:Boolean,
    create:Boolean,
    isFilled:_=>true,
    copy:bol=>bol,
    rand:bolRnd,
}).defineFrom({
    arr:v=>!!v.length, //    bol: arr => !!arr.length,
    //bol:,
    dt:v=>!!v.getTime(),
    err:v=>true,
    fn:v=>true,
    map:v=>isFilleds(v.values()),
    num:v=>!!v,
    obj:v=>isFilleds(v),
    rgx:v=>true,
    set:v=>!!v.size,
    str:strToBol,
    sym:v=>strToBol(symToStr(v))
})

