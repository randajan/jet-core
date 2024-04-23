import jet from "../../defs";

const to = sym=>String(sym).slice(7, -1);

jet.define("Symbol", Symbol, {
    create:Symbol,
    copy:x=>Symbol(to(x)),
    rnd:(...a)=>Symbol(jet.rnd.String(...a)),
    to:{
        Function:sym=>_=>sym
    }
});