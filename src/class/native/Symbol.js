import { jet } from "../../defs";

const to = sym => String(sym).slice(7, -1);

jet.define("Symbol", {
    self: Symbol,
    create: Symbol,
    copy: x => Symbol(to(x)),
    rnd: (...a) => Symbol(jet.rnd.String(...a)),
}).defineTo({
    Function: sym => _ => sym
})