
import { solids } from "../../defs/solid";
import { Primitive } from "./Primitive";


export class Iterable extends Primitive {
    static isIterable = true;

    constructor(def, name, opt) {
        const { keys, values, entries, get, set, rem } = opt;

        super(def, name, opt);
        
        const enumerable = true;
        Object.defineProperties(this, {
            keys:{ enumerable, value:keys },
            values:{ enumerable, value:values },
        });

        solids(this, {
            keys,
            values,
            entries,
            get:get || ((x, k) => x[k]),
            set:set || ((x, k, v) => x[k] = v),
            rem:rem || ((x, k) => delete x[k])
        });
        
    }

}