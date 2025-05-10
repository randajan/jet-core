import { jet }from "../../defs";

jet.define("bool", {
    self:Boolean,
    create:Boolean,
    rnd:(trueRatio=.5)=>Math.random() < trueRatio
}).defineTo({
    fn:bol=>_=>bol
});

