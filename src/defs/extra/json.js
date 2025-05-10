import { solids } from "@randajan/props";
import Ł, { jet } from "../base.js";


export const json = solids({}, {
    from: (json, throwErr=false)=>{
        if (jet.isIterable(json)) { return json; }
        try { return JSON.parse(Ł.str.to(json)); }
        catch(e) { if (throwErr === true) { throw e } }
    },
    to: (obj, prettyPrint=false)=>{
        const spacing = Ł.num.only(prettyPrint === true ? 2 : prettyPrint);
        return JSON.stringify(jet.isIterable(obj) ? obj : {}, null, spacing);
    }
})