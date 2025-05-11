import { define } from "../../defs/tools";

import { _fn } from "./Function";

export default define("prom", {
    self:Promise, 
    create:x=>new Promise(_fn.only(x, e=>e()))
});