import { solids } from "../../defs/solid";
import { Plex } from "./Plex";



export class Unknown extends Plex {
    static isIterable = false;

    constructor(def, name) {
        super((...a)=>this.to(...a));

        const { isIterable } = this.constructor;

        solids(this, {
            name,
            isIterable,
            is:this.is.bind(this),
            to:this.to.bind(this),
            orNull:this.orNull.bind(this),
            defineTo:this.defineTo.bind(def)
        });
    }

    is(any, strict=true) { return false; }
    to(any, ...args) {}
    orNull(any, ...args) {}

    isFull(any) {
        if (!this.isIterable) { return (any === false || any === 0 || !!any); }
        for (let v of this.values(any)) { if (v === false || v === 0 || !!v) { return true; }}
        return false;
    }

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