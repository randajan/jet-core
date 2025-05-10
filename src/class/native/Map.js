import { jet }from "../../defs";

jet.define("Map", {
    self:Map,
    copy:x=>new Map(x),
    keys:x=>[...x.keys()],
    vals:x=>[...x.values()],
    entries:x=>[...x.entries()],
    get:(x,k)=>x.get(k),
    set:(x,k,v)=>x.set(k,v),
    rem:(x,k)=>x.delete(k),
}).defineTo({
    Function:map=>_=>map
})