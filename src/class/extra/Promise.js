import { jet }from "../../defs";

jet.define("Promise", {
    self:Promise, 
    create:x=>new Promise(jet.only.Function(x, e=>e()))
});