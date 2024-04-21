import jet from "../../dist/index.js";
import example from "./example.json";

window.jet = jet;


const result = jet.remap({a:3, z:2, f:0, d:9, q:1}, (v, ctx)=>{
    console.log(v);
    return v;
}, {
    strictArray:true,
    orderBy:[(v, k)=>k, false]
});


console.log(result);