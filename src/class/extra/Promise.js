import { Definition } from "../self/Definition";
import { _fn } from "../native/Function";

const pass = async v=>v;


export default Definition.createType("prom", {
    self:Promise,
    copy:async prom=>await prom,
    create:x=>new Promise(_fn.only(x, e=>e()))
}).defineFrom({
    arr:pass,
    bol:pass,
    dt:pass,
    err:async err =>{ throw err; },
    fn:async (fn, ...args) => await fn(...args),
    map:pass,
    num:pass,
    obj:pass,
    rgx:pass,
    set:pass,
    str:pass,
    sym:pass,
});