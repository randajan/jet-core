import { solids } from "../../defs/solid";
import { isFilled } from "../../defs/statics";
import { FnProxy } from "./FnProxy";



export class NoType extends FnProxy {
    static isIterable = false;

    constructor(def, name) {
        super((...a)=>this.create(...a));

        const { isIterable } = this.constructor;

        solids(this, {
            name,
            isIterable,
            create:this.create.bind(def),
            rand:this.rand.bind(def),
            is:this.is.bind(def),
            to:this.to.bind(def),
            copy:this.copy.bind(def),
            isFilled:this.isFilled.bind(def),
            isBlank:this.isBlank.bind(def),
            orNull:this.orNull.bind(def),
            defineTo:this.defineTo.bind(def),
            defineFrom:this.defineFrom.bind(def),
            extend:this.extend.bind(def)
        });
    }

    create() {}
    rand() {}

    is(any) { return false; }
    to(any, ...args) {  }
    orNull(any, ...args) {}

    copy(any) { fail("unknown type copy failed"); }

    isFilled(any) { return isFilled(any); }

    isBlank(any) { return !isFilled(any); }

    defineTo(to, exe) { //rebinded def
        const tt = typeof to;
        if (tt === "function") { this.to.set("*", to); }
        else if (Array.isArray(to)) { for (let i in to) { this.to.set(to[i], exe); } }
        else if (tt === "object") { for (let i in to) { this.to.set(i, to[i]); } }
        else { this.to.set(to, exe); }

        return this.type;
    }

    defineFrom(from, exe) {
        const tf = typeof from;
        if (tf === "function") { this.from.set("*", from); }
        else if (Array.isArray(to)) { for (let f of from) { this.from.set(f, exe); } }
        else if (tf === "object") { for (let i in from) { this.from.set(i, from[i]); } }
        else { this.from.set(from, exe); }

        return this.type;
    }

    addTools(tools={}) {
        const { name } = this;
        if (typeof tools !== "object") { fail(`tools must be typeof object`, name); }
        solids(this, tools);
        return this;
    }

    extend(name, opt={}) {
        return this.constructor.createType(name, opt, this);
    }
}