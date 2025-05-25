import { isIterable } from "../defs/tools";
import { _str } from "../class/native/String";
import { solids } from "../defs/solid";

export const json = solids({
    from: (json, throwErr = false) => {
        if (isIterable(json)) { return json; }
        try { return JSON.parse(_str.to(json)); }
        catch (e) { if (throwErr === true) { throw e } }
    },
    to: (obj, prettyPrint = false) => {

        const spacing = typeof prettyPrint === "number" ? prettyPrint : prettyPrint === true ? 2 : 0;

        return JSON.stringify(isIterable(obj) ? obj : {}, null, spacing);
    }
});