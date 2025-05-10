import { solids } from "@randajan/props";
import { Primitive } from "./Primitive";



export class Iterable extends Primitive {
    static isIterable = true;

    constructor(def, name, opt) {
        const { keys, vals, entries, get, set, rem } = opt;

        super(def, name, opt);

        solids(this, {
            keys,
            vals,
            entries,
            get:get || ((x, k) => x[k]),
            set:set || ((x, k, v) => x[k] = v),
            rem:rem || ((x, k) => delete x[k])
        });
        
    }
}