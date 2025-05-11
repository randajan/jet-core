import { fail, getDefByName, register, warn } from "../../defs/statics";
import * as _ from "../../defs/statics";
import { Iterable } from "./Iterable";
import { Primitive } from "./Primitive";

const _options = [ "self", "create", "primitive", "is", "isFull", "copy", "rnd", "keys", "values", "entries", "get", "set", "rem" ];

export class Definition {

    static create(name, opt={}) { return new Definition(name, opt); }

    constructor(name, opt={}) {
        if (getDefByName(name)) { fail("is allready defined", name); }

        const { self, is, keys, values, entries } = opt;

        if (!self) { fail("definition.self (constructor) missing", name); }
        if ((keys || values || entries) && !(keys && values && entries)) { fail("keys, values or entries missing", name); }
        
        const unknownOpt = Object.keys(opt).filter(p => !_options.includes(p)); // validate options
        if (unknownOpt.length) { warn(`unknown definition: '${unknownOpt.join("', '")}'`, name); }

        this.is = is || (_=>true);
        this.to = new Map();
        this.type = entries ? new Iterable(this, name, opt) : new Primitive(this, name, opt);
        
        register(this);
    }
}