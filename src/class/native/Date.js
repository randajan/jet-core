import Ł, { jet } from "../../defs";

jet.define("date", {
    self:Date,
    create:x=>!x ? new Date() : new Date(x),
    rnd:(from, to)=>new Date(Ł.num.rnd((new Date(from)).getTime(), to ? (new Date(to)).getTime() : Date.now()*2))
}).defineTo({
    fn:date=>_=>date
})