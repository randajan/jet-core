import jet from "../../dist/index.js";
import { map, flat, find } from "../../dist/each/eachSync.js";

import example from "./example.json";

window.jet = jet;

(async ()=>{

    const result = flat({a:3, z:12, f:9, d:5, q:4}, (v, ctx)=>{
        return ctx.key
    }, {
        strictArray:true,
        orderBy:[(v, k)=>k, true],
        stopable:true
    });

    console.log(jet.deflate(example, true));

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