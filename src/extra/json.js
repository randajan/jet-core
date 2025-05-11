import { solids } from "@randajan/props";

import { isIterable } from "../defs/tools";
import { _num } from "../class/native/Number";
import { _str } from "../class/native/String";

export const json = solids({}, {
    from: (json, throwErr = false) => {
        if (isIterable(json)) { return json; }
        try { return JSON.parse(_str.to(json)); }
        catch (e) { if (throwErr === true) { throw e } }
    },
    to: (obj, prettyPrint = false) => {
        const spacing = _num.only(prettyPrint === true ? 2 : prettyPrint);
        return JSON.stringify(isIterable(obj) ? obj : {}, null, spacing);
    }
});