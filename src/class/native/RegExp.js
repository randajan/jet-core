import { anyToFn } from "@randajan/function-parser";
import { _str } from "./_String";
import { rgx2str, rgxLib, str2rgx } from "../../defs/regex";

export const _rgx = _str.extend("rgx", {
    self: RegExp,
    create: RegExp,
    copy: x => RegExp(x.source),
    from:rgx=>rgx2str(rgx),
    to:str=>str2rgx(str)
}).defineTo({
    arr:rgx=>[rgx],
    fn: anyToFn,
}).addTools({
    lib: rgxLib
})