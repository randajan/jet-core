import jet from "../../dist/index.js";
import { map, flat, find } from "../../dist/each/eachAsync.js";

import example from "./example.json";

window.jet = jet;

(async ()=>{

    const result = find({a:3, z:12, f:9, d:5, q:4}, async (v, ctx)=>{
        return new Promise((res, rej)=>{
            setTimeout(_=>res(ctx.key), v*500);
        })
    }, {
        strictArray:true,
        orderBy:[async (v, k)=>k, true],
        stopable:true
    });

    console.log(await result);

})();
