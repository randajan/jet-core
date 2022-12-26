import jet from "../jet";

export default jet.define("Object", Object, {
    create:Object,
    copy:x=>Object.defineProperties({}, Object.getOwnPropertyDescriptors(x)),
    keys:x=>Object.keys(x),
    vals:x=>Object.values(x),
    entries:x=>Object.entries(x),
    extendPrototype:false,
    to:{
        Function:obj=>_=>obj,
        Symbol:obj=>Symbol(jet.json.to(obj)),
        Boolean:obj=>jet.isFull.Object(obj),
        Number:obj=>Object.values(obj),
        Array:obj=>Object.values(obj),
        String:obj=>obj.toString ? obj.toString() : jet.json.to(obj),
        Promise:async obj=>obj,
        Error:obj=>jet.json.to(obj),
        RegExp:(obj, comma)=>jet.melt(obj, comma != null ? comma : "|")
    }
});
