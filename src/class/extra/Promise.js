import { Definition } from "../self/Definition";
import { _fn } from "../native/Function";

export default Definition.createType("prom", {
    self:Promise, 
    create:x=>new Promise(_fn.only(x, e=>e()))
});