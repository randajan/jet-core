import jet from "../../dist/index.js";
import { map, list, find } from "../../dist/each/eachAsync.js";

import example from "./example.json";

window.jet = jet;

(async ()=>{

    const result = await list(example, (v, ctx)=>{
        return [ctx.fullpath, v];
    }, {
        strictArray:true,
        //orderBy:[(v, k)=>k, true],
        stopable:true,
        deep:true,
        root:["XXX\\.b"]
    });

    console.log(Object.fromEntries(result));

})();

console.log(jet.compare({
    name: "Objekt 1",
    age: 25,
    address: {
      city: "Praha",
      street: "Hlavní",
      ".postalCode": "10000"
    },
    hobbies: ["plavání", "čtení", "programování"],
    status: "aktivní"
}, {
    name: "Objekt 1",
    age: 25,
    address: {
      city: "Praha",
      street: "Hlavní",
      ".postalCode": "10100"
    },
    hobbies: ["plavání", "čtení", "programování"],
    status: "neaktivní"
}));