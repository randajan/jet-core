import { jet }from "../../defs";

jet.define("prom", {
    self:Promise, 
    create:x=>new Promise(jet.only.Function(x, e=>e()))
});