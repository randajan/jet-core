import { jet }from "../../defs";

jet.define("Boolean", {
    self:Boolean,
    create:Boolean,
    rnd:(trueRatio=.5)=>Math.random() < trueRatio
}).defineTo({
    Function:bol=>_=>bol
});

