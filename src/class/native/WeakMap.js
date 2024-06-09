import jet from "../../defs";

jet.define("WeakMap", WeakMap, {
    copy:x=>new WeakMap(),
    get:(x,k)=>x.get(k),
    set:(x,k,v)=>x.set(k,v),
    rem:(x,k)=>x.delete(k),
    to:{
        Function:map=>_=>map
    }
});