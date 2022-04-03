import jet from "../jet";

export default jet.define("Map", Map, {
    copy:x=>new Map(x),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    entries:x=>x.entries(),
    get:(x,k)=>x.get(k),
    set:(x,k,v)=>x.set(k,v),
    rem:(x,k)=>x.delete(k),
});