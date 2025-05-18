import { getTypeByInst } from "../defs/statics";

import { _num } from "../class/native/_Number";
import { _str } from "../class/native/_String";


export const _getRand = (arr, min, max, sqr)=>{ //get random element from array or string
    if (!arr?.length) { return; }
    const l = arr.length;
    return arr[Math.floor(_num.rand(_num.frame(min||0, 0, l), _num.frame(max||l, 0, l), sqr))];
};

export const getRand = (any, min, max, sqr)=>{
    const type = getTypeByInst(any);
    if (type.isIterable) { any = type.values(any); }
    else if (typeof any !== "string") { return; }
    return _getRand(any, min, max, sqr);
}