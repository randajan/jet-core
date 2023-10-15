import jet from "../jet";

export default jet.define("Boolean", Boolean, {
    create:Boolean,
    rnd:(trueRatio=.5)=>Math.random() < trueRatio,
    to:{
        Function:bol=>_=>bol
    }
});

