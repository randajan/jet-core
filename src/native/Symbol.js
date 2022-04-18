import jet from "../jet";

const to = sym=>String(sym).slice(7, -1);

export default jet.define("Symbol", Symbol, {
    create:Symbol,
    copy:x=>Symbol(to(x)),
    rnd:(...a)=>Symbol(jet.rnd.String(...a)),
    to
});