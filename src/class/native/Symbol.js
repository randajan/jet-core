import { _str } from "./_String";

const stringify = sym => String(sym).slice(7, -1);

export const _sym = _str.extend("sym", {
    self: Symbol,
    create: Symbol,
    isFilled:_=>true,
    copy: x => Symbol(stringify(x)),
    rand: (...a) => Symbol(_str.rand(...a)),
    from:sym=>stringify(sym),
    to:str=>Symbol(str)
}).defineTo({
    arr: sym => [sym],
})