import jet from "../jet";

export default jet.define("Promise", Promise, {
    create:x=>new Promise(jet.only.Function(x, e=>e()))
});