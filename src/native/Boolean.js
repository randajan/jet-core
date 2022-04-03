import jet from "../jet";

export default jet.define("Boolean", Boolean, {
    create:Boolean,
    rnd:trueRatio=>Math.random() < (trueRatio||.5),
});

