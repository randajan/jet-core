import jet from "../../dist/index.js";
import { map, flat, find } from "../../dist/each/eachAsync.js";

import example from "./example.json";

window.jet = jet;

(async ()=>{

    const result = flat({a:3, z:2, f:1, d:5, q:4}, async (v, ctx)=>{
        console.log(ctx.key, v, ctx.pending);
        return ctx.key;
    }, {
        strictArray:true,
        orderBy:[async (v, k)=>new Promise((res, rej)=>{
            setTimeout(_=>res(k), v*500)
        }), true]
    });

    console.log(await result);

})();
