import { _str } from "./String";

const to = sym => String(sym).slice(7, -1);

export const _sym = _str.extend("sym", {
    self: Symbol,
    create: Symbol,
    isFilled:_=>true,
    copy: x => Symbol(to(x)),
    rand: (...a) => Symbol(_str.rand(...a)),
}).defineTo({
    "*":to,
    arr: sym => [sym],
    //bool,
    //date,
    //err,
    //fn
    //map,
    //num,
    //obj,
    set: sym => new Set([sym]),
    //str,
    //sym,
})