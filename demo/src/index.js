import jet from "../../dist/index.js";
import example from "./example.json";

window.jet = jet;


const result = jet.remap(example, (v, ctx)=>{
    return v.name;
}, { deep:false, orderBy:[ v=>v.name ] });


console.log(result);