import { symToStr } from "../../defs/convert";
import { _str } from "./String";

export const _sym = _str.extend("sym", {
    self: Symbol,
    create: Symbol,
    isFilled:_=>true,
    copy: x => Symbol(symToStr(x)),
    rand: (...a) => Symbol(_str.rand(...a)),
    from:symToStr,
    to:str=>Symbol(str)
});