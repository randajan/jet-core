import { solids } from "@randajan/props";
import { getDefByInst, fail } from "../../defs/base";
import * as _ from "../../defs/methods";

export class Primitive {
    static isIterable = false;

    constructor(def, name, opt) {
        const { self, create, isFull, copy, rnd } = opt;
        const { isIterable } = this.constructor;

        solids(this, {
            name,
            def,
            self,
            create:create || ((...a)=>new self(...a)),
            copy:copy || (any=>any),
            rnd:rnd || create,
            isFull:isFull || (any=>_.isFull(any, isIterable)),
            isIterable
        });

        this.is = this.is.bind(this);
        this.to = this.to.bind(this);
        this.defineTo = this.defineTo.bind(def);

    }

    is(any, strict=true) {
        const { self } = this; //rebinded
        if (any == null) { return false; }
        if (any.constructor !== self && !(any instanceof self)) { return false; }
        const def = getDefByInst(any, strict);
        return !def ? false : def.type === this;
    }
    
    to(any, ...args) {
        const { name, create } = this;
        const def = getDefByInst(any, false);
        if (!def) { return create(); }
        if (def.type === this) { return any; }
        const exe = def.to.get(name) || def.to.get("*");
        if (!exe) { return create(); }
        return this.to(exe(any, ...args), ...args);
    }

    full(...a) { return _.factory(this, 0, ...a); }
    only(...a) { return _.factory(this, 1, ...a); }
    tap(...a) { return _.factory(this, 2, ...a); }
    pull(...a) { return _.factory(this, 3, ...a); }

    extend(extender={}) {
        const { name } = this;
        if (typeof extender !== "object") { fail(`extender must be typeof object`, name); }
        solids(this, extender);
        return this;
    }

    defineTo(to, exe) {
        //this is rebinded in constructor to def
        const tt = typeof to;
        if (tt === "function") { this.to.set("*", to); }
        else if (Array.isArray(to)) { for (let i in to) { this.to.set(to[i], exe); } }
        else if (tt === "object") { for (let i in to) { this.to.set(i, to[i]); } }
        else { this.to.set(to, exe); }

        return this.type;
    }
}