import { fail, getDefByName, register, warn } from "../../defs/statics";
import * as _ from "../../defs/statics";
import { Iterable } from "./Iterable";
import { Primitive } from "./Primitive";

const _options = [ "self", "create", "is", "isFilled", "copy", "rand", "keys", "values", "entries", "get", "set", "del" ];

export class Definition {

    static create(name, opt={}) { return new Definition(name, opt); }
    static createType(name, opt={}) { return this.create(name, opt).type; }

    constructor(name, opt={}, parent=null) {
        if (getDefByName(name)) { fail("is allready defined", name); }

        const { self, create, rand, is, isFilled, copy, keys, values, entries } = opt;

        if (!self) { fail("definition.self (constructor) missing", name); }
        if ((keys || values || entries) && !(keys && values && entries)) { fail("keys, values or entries missing", name); }
        
        const unknownOpt = Object.keys(opt).filter(p => !_options.includes(p)); // validate options
        if (unknownOpt.length) { warn(`unknown definition: '${unknownOpt.join("', '")}'`, name); }

        this.parent = parent;
        this.name = name;
        this.create = create || ((...a)=>new self(...a));
        this.rand = rand || this.create;
        this.is = is || (_=>true);
        this.copy = copy || (_=>fail("copy method not defined", name));
        this.to = new Map();
        this.isFilled = isFilled || (!entries ? _.isFilled : any=>_.isFulls(values(any)));
        this.type = entries ? new Iterable(this, name, opt) : new Primitive(this, name, opt);
        
        register(this);
    }
}