import { solid } from "@randajan/props";
import { fail, getDefByName, register, warn } from "../../defs/base";
import * as _ from "../../defs/methods";
import { Iterable } from "./Iterable";
import { Primitive } from "./Primitive";

const _options = [ "self", "create", "is", "isFull", "copy", "rnd", "keys", "vals", "entries", "get", "set", "rem" ];

export class Definition {

    static create(name, opt={}) { return new Definition(name, opt); }

    constructor(name, opt={}) {
        if (getDefByName(name)) { fail("is allready defined", name); }

        const { self, is, keys, vals, entries } = opt;

        if (!self) { fail("definition.self (constructor) missing", name); }
        if ((keys || vals || entries) && !(keys && vals && entries)) { fail("keys, vals or entries missing", name); }
        
        const unknownOpt = Object.keys(opt).filter(p => !_options.includes(p)); // validate options
        if (unknownOpt.length) { warn(`unknown definition: '${unknownOpt.join("', '")}'`, name); }

        this.is = is || (_=>true);
        this.to = new Map();
        this.type = entries ? new Iterable(this, name, opt) : new Primitive(this, name, opt);
        
        register(this);
    }
}