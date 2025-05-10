import { jet }from "../../defs";

jet.define("Error", {
    self:Error,
    create:Error,
    rnd:(...a)=>new Error(jet.rnd.String(...a)),
}).defineTo({
    Function:err=>_=>err
})
