import { fail, getDefByName, register, warn } from "../../defs/statics";
import * as _ from "../../defs/statics";
import { Iterable } from "./Iterable";
import { Primitive } from "./Primitive";

const _options = [ "self", "from", "to", "create", "is", "isFilled", "copy", "rand", "keys", "values", "entries", "get", "set", "del" ];

export class Definition {

    static create(name, opt={}, parent=null) { return new Definition(name, opt, parent); }
    static createType(name, opt={}, parent=null) { return Definition.create(name, opt, parent).type; }

    constructor(name, opt={}, parent=null) {
        if (getDefByName(name)) { fail("is allready defined", name); }

        const { self, create, rand, is, isFilled, copy, keys, values, entries, from, to } = opt;

        if (!self) { fail("opt.self (constructor) missing", name); }
        if (parent && (!to || !from)) { fail("opt.from or opt.to missing", name); }
        if ((keys || values || entries) && !(keys && values && entries)) { fail("opt.keys, opt.values or opt.entries missing", name); }
        
        const unknownOpt = Object.keys(opt).filter(p => !_options.includes(p)); // validate options
        if (unknownOpt.length) { warn(`unknown definition: '${unknownOpt.join("', '")}'`, name); }

        this.parent = parent;
        this.name = name;
        this.create = create || ((...a)=>new self(...a));
        this.rand = rand || this.create;
        this.is = is || (_=>true);
        this.copy = copy || (_=>fail("copy method not defined", name));
        this.from = new Map(); //conversion table
        this.to = new Map();
        this.isFilled = isFilled || (!entries ? _.isFilled : any=>_.isFilleds(values(any)));
        this.type = entries ? new Iterable(this, name, opt) : new Primitive(this, name, opt);

        if (parent) {
            this.to.set(parent.name, from);
            if (to) { parent.to.set(name, to); }
        }
        
        register(this);
    }
}