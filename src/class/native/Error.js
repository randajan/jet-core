import { jet }from "../../defs";

jet.define("err", {
    self:Error,
    create:Error,
    rnd:(...a)=>new Error(jet.rnd.String(...a)),
}).defineTo({
    fn:err=>_=>err
})
