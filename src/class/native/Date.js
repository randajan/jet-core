import jet from "../../defs";

jet.define("Date", Date, {
    create:x=>!x ? new Date() : new Date(x),
    rnd:(from, to)=>new Date(Number.jet.rnd((new Date(from)).getTime(), to ? (new Date(to)).getTime() : Date.now()*2)),
    to:{
        Function:date=>_=>date
    }
});