import jet from "../jet";

export default jet.define("Symbol", Symbol, {
    create:Symbol,
    rnd:(...a)=>Symbol(jet.rnd.String(...a)),
    to:sym=>String(sym).slice(7, -1)
});