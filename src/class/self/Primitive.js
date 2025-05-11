import { solids } from "@randajan/props";
import { getDefByInst, fail, factory, getTypeByInst } from "../../defs/statics";
import { Unknown } from "./Unknown";

export class Primitive extends Unknown {
    static isIterable = false;

    constructor(def, name, opt) {
        super(def, name);

        const { self, create, primitive, isFull, copy, rnd } = opt;

        solids(this, {
            self,
            create:create || ((...a)=>new self(...a)),
            primitive,
            copy:copy || (any=>any),
            rnd:rnd || create,
            isFull:isFull || this.isFull.bind(this)
        });
    }

    is(any, strict=true) {
        const { self } = this; //rebinded
        if (any == null) { return false; }
        if (any.constructor !== self && !(any instanceof self)) { return false; }
        return this === getTypeByInst(any, strict);
    }
    
    to(any, ...args) {
        const { name, primitive } = this;
        const def = getDefByInst(any, false);
        if (def.type === this) { return any; }
        const exe = def.to.get(name) || def.to.get(primitive) || def.to.get("*");
        if (!exe) { fail(`unable create from '${def.type.name}'`, name); }
        return this.to(exe(any, ...args), ...args);
    }
    
    orNull(any, ...args) {
        if (any != null) { return this.to(any, ...args); }
    }

    full(...a) { return factory(this, 0, ...a); }
    only(...a) { return factory(this, 1, ...a); }
    tap(...a) { return factory(this, 2, ...a); }
    pull(...a) { return factory(this, 3, ...a); }

}