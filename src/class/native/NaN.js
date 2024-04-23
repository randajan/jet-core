import jet from "../../defs";

jet.define("NaN", Number, {
    create:_=>NaN,
    is:isNaN,
    extend:false,
    to:_=>undefined
});