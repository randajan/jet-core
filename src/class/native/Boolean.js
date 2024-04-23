import jet from "../../defs";

jet.define("Boolean", Boolean, {
    create:Boolean,
    rnd:(trueRatio=.5)=>Math.random() < trueRatio,
    to:{
        Function:bol=>_=>bol
    }
});

