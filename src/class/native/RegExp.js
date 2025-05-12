import { anyToFn } from "@randajan/function-parser";
import { define } from "../../defs/tools";

export const _rgx = define("rgx", {
    self: RegExp,
    create: RegExp,
    primitive:"str",
    copy: x => RegExp(x.source),
}).defineTo({
    "*": rgx => rgx.source,
    arr:rgx=>[rgx],
    //bool,
    //date,
    //err,
    fn: anyToFn,
    //map,
    //num,
    //obj,
    //rgx,
    set:rgx=>new Set([rgx]),
    //str,
    sym: rgx => Symbol(rgx.source),
}).extend({
    lib: {
        line: /[^\n\r]+/g,
        number: /-?(\d+(\s+\d+)*)*[,.]?\d+/,
        word: /[^\s\n\r]+/g,
        num: /-?[0-9]*[.,]?[0-9]+/,
        email: /(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
        ip: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))/i,
        domain: /([a-z0-9]+\.)+(cz|de|sk|au|com|eu|info|org|[a-z]+)/i,
        hexadecimal: /[0-9a-fA-F]{6,6}/,
    }
})