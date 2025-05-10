import { fail, warn } from "../../defs/base";
import * as _ from "../../defs/methods";

const _options = [ "self", "create", "is", "isFull", "copy", "rnd", "keys", "vals", "entries", "get", "set", "rem" ];

export class TypeDefinition {
    constructor(int, opt={}) {
        const { name } = int;

        const { self, create, is, isFull, copy, rnd, keys, vals, entries, get, set, rem } = opt;

        if (!self) { fail("definition.self (constructor) missing", name); }
        
        const unknownOpt = Object.keys(opt).filter(p => !_options.includes(p)); // validate options
        if (unknownOpt.length) { warn(`unknown definition: '${unknownOpt.join("', '")}'`, name); }

        this.int = int;
        this.self = self;
        this.is = is || (_=>true);
        this.isFull = isFull || (any=>_.isFull(any, vals));

        this.create = create || ((...a)=>new self(...a));
        this.copy = copy || (any=>any);
        this.rnd = rnd || create;
        this.to = {}; //TODO

        if ((keys || vals || entries) && !(keys && vals && entries)) { fail("keys, vals or entries missing", name); }
        
        if (entries) {
            this.keys = keys;
            this.vals = vals;
            this.entries = entries;
            this.get = get || ((x, k) => x[k]);
            this.set = set || ((x, k, v) => x[k] = v);
            this.rem = rem || ((x, k) => delete x[k]);
        }
    }
}