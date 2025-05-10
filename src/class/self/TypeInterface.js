import { solid, solids } from "@randajan/props";
import { TypeDefinition } from "./TypeDefinition";
import { getDefByInst, getDefByName, fail, register } from "../../defs/base";
import * as _ from "../../defs/methods";

export class TypeInterface {
    constructor(name, definition={}) {
        if (getDefByName(name)) { fail("is allready defined", name); }

        solid(this, "name", name);
        this.def = new TypeDefinition(this, definition); //TODO private?

        if (!this.def.self.jet) { solid(this.def.self, "jet", this); } //TODO REMOVE

        this.isMapable = !!this.def.entries;

        register(this);
    }

    is(any, strict=true) {
        const { def } = this;
        if (any == null) { return false; }
        if (any.constructor !== def.self && !(any instanceof def.self)) { return false; }
        return getDefByInst(any, strict) === this;
    }

    create(...a) { return this.def.create(...a); }
    rnd(...a) { return this.def.rnd(...a); }
    isFull(...a) { return this.def.isFull(...a); }
    
    to(any, ...args) {
        const { def, name } = this;
        const at = getDefByInst(any, false);
        if (!at) { return def.create(); }
        if (this === at) { return any; }
        const exe = at.def.to[name] || at.def.to["*"];
        if (!exe) { return def.create(); }
        return this.to(exe(any, ...args), ...args);
    }

    only(...a) { return _.factory(this.name, 0, ...a); }
    full(...a) { return _.factory(this.name, 1, ...a); }
    tap(...a) { return _.factory(this.name, 2, ...a); }
    pull(...a) { return _.factory(this.name, 3, ...a); }

    keys(...a) { return this.def.keys(...a); }
    vals(...a) { return this.def.vals(...a); }
    entries(...a) { return this.def.entries(...a); }
    get(...a) { return this.def.get(...a); }
    set(...a) { return this.def.set(...a); }
    rem(...a) { return this.def.rem(...a); }

    getRnd (any, min, max, sqr) { return _.getRnd(vals(any), min, max, sqr); }

    extend(extender={}) {
        const { name } = this;
        if (typeof extender !== "object") { fail(`extender must be typeof object`, name); }

        solids(this, extender);

        return this;
    }

    defineTo(to, exe) {
        const { def } = this;
        const tt = typeof to;
        const conv = def.to;
        if (tt === "function") { conv["*"] = to; }
        else if (Array.isArray(to)) { for (let i in to) { conv[to[i]] = exe; } }
        else if (tt === "object") { for (let i in to) { conv[i] = to[i]; } }
        else { conv[to] = exe; }

        return this;
    }
}