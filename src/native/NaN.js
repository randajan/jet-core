import jet from "../jet";

export default jet.define("NaN", Number, {
    create:_=>NaN,
    is:isNaN,
    extend:false,
    to:_=>undefined
});