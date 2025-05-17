import { _obj } from "./Object";

export const _map = _obj.extend("map", {
    self:Map,
    isFilled:x=>!!x.size,
    copy:x=>new Map(x),
    keys:x=>[...x.keys()],
    values:x=>[...x.values()],
    entries:x=>[...x.entries()],
    get:(x,k)=>x.get(k),
    set:(x,k,v)=>x.set(k,v),
    del:(x,k)=>x.del(k),
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