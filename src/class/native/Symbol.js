import { define } from "../../defs/tools";
import { _str } from "./String";


export const _sym = define("sym", {
    self: Symbol,
    create: Symbol,
    primitive:"str",
    copy: x => Symbol(to(x)),
    rnd: (...a) => Symbol(_str.rnd(...a)),
}).defineTo({
    "*":sym => String(sym).slice(7, -1),
    arr: sym => [sym],
    //bool,
    //date,
    //err,
    //fn
    //map,
    //num,
    //obj,
    prom: async sym => sym,
    set: sym => new Set([sym]),
    //str,
    //sym,
})