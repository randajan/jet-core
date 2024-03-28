import jet from "../jet";
import Pool from "./Pool";

class RunPool extends Pool {
    constructor(...items) {
        const _p = {with:[]};
        super(...items);
        this.autoFilter(jet.isRunnable);
        Object.defineProperty(this, "_with", { get:_=>_p.with, set:v=>_p.with=Array.jet.to(v)});
    }

    with(...args) {
        this._with = args;
        return this;
    }

    run(...args) {
        const first = !this._run;
        let r = this._run = [];
        for (const fce of this) {
            r.push(fce(...this._with, ...args));
            if (r !== this._run) { break; }
        }
        r = this._run;
        if (first) { delete this._run; }
        return r;
    }

    fit(...args) {
        if (this._fit) { throw "RunPool.fit maximum call stack size exceeded"; }
        this._fit = true;

        const w = this._with;
        const result = jet.reducer((next, i, ...a)=>
            this[i] ? this[i](next, ...w, ...a) : a[0]
        )(...w, ...args);

        delete this._fit;

        return result;
    }
}

export default jet.define("RunPool", RunPool, {
    copy:x=>(new RunPool(...x)).autoFilter(x._autoFilter).autoSort(x._autoSort),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    entries:x=>x.entries(),
});