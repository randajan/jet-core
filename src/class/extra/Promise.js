import { Definition } from "../self/Definition";
import { _fn } from "../native/_Function";

export default Definition.createType("prom", {
    self:Promise,
    copy:async prom=>await prom,
    create:x=>new Promise(_fn.only(x, e=>e()))
});