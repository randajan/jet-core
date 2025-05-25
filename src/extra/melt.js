import { _str } from "../class/native/String";
import { getTypeByInst } from "../defs/statics";
import { isRunnable } from "../sync";

const _melt = (any, comma, trait, r="")=>{
    const type = getTypeByInst(any);

    if (type.isIterable) {
        for (const v of type.values(any)) { r = _melt(v, comma, trait, r); }
    } else {
        const v = _str.to(trait(any));
        if (v) { r += (r?comma:"")+v; }
    }
    
    return r;
}


export const melt = (any, comma, trait)=>{
    if (!isRunnable(trait)) { trait = _=>_; }
    return _melt(any, _str.to(comma), trait);
}