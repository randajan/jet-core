import { define } from "../../defs/tools";

export const _map = define("map", {
    self:Map,
    primitive:"obj",
    copy:x=>new Map(x),
    keys:x=>[...x.keys()],
    values:x=>[...x.values()],
    entries:x=>[...x.entries()],
    get:(x,k)=>x.get(k),
    set:(x,k,v)=>x.set(k,v),
    rem:(x,k)=>x.delete(k),
}).defineTo({
    "*":map=>Object.fromEntries(map.entries()),
    arr: map => [...map.values()],
    bool: map => !!map.size,
    //date,
    //err,
    //fn,
    //map,
    num: map => map.size,
    //obj,
    set: map => new Set(map.values()),
    //str,
    //sym,
})