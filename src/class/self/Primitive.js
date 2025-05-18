import { solids } from "../../defs/solid";
import { getDefByInst, fail, factory, getTypeByInst, warn } from "../../defs/statics";
import { NoType } from "./NoType";

export class Primitive extends NoType {
    static isIterable = false;

    constructor(def, name, opt) {
        super(def, name);

        const { self, fallback } = opt;

        solids(this, { self, fallback });
    }

    create(...a) { return this.create(...a); }
    rand(...a) { return this.rand(...a); }

    is(any) { //rebinded def
        const { self } = this.type; 
        if (any == null) { return false; }
        if (any.constructor !== self && !(any instanceof self)) { return false; }
        return this.type === getTypeByInst(any);
    }

    isFilled(any) { //rebinded def
        const { type:{ is }, isFilled } = this;
        return is(any) && !!isFilled(any);
    }

    isBlank(any) { //rebinded def
        const { type:{ is }, isFilled } = this;
        return is(any) && !isFilled(any);
    }
    
    to(any, ...args) { //rebinded def
        const { type:{ name, to }, parent} = this;
        const def = getDefByInst(any, false);
        if (def === this) { return any; }
        warn(`converting to ${name}`, def.name);
        const exe = def.to.get(name) || def.to.get("*") || def.to.get(parent?.name);
        if (!exe) { fail(`unable convert to '${name}'`, def.name); }
        try { return to(exe(any, ...args), ...args); }
        catch(err) { fail(`unable convert to '${name}'`, def.name, err); }
    }
    
    orNull(any, ...args) { //rebinded def
        if (any != null) { return this.type.to(any, ...args); }
    }

    copy(any) { //rebinded def
        const { name, is } = this.type;
        if (is(any)) { return this.copy(any); }
        fail(`copy failed - type mismatch`, name);
    }

    filled(...a) { return factory(this, 0, ...a); }
    only(...a) { return factory(this, 1, ...a); }
    ensure(...a) { return factory(this, 2, ...a); }
    ensureCopy(...a) { return factory(this, 3, ...a); }
}