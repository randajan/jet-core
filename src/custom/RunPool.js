import jet from "../jet";
import Pool from "./Pool";

class RunPool extends Pool {
    constructor(...a) {
        super(...a);
        this.autoFilter(Function.jet.is).with();
    }

    with(...args) {
        this.with._current = args;
        return this;
    }

    run(...args) {
        const r = this.run, first = !r._current;
        let rc = r._current = [];
        for (const fce of this) {
            rc.push(fce(...this.with._current, ...args));
            if (rc !== r._current) { break; }
        }
        rc = r._current;
        if (first) { delete r._current; }
        return rc;
    }

    fit(...args) {
        if (this.fit._current) { throw "RunPool.fit maximum call stack size exceeded"; }
        this.fit._current = true;

        let i = 0; args = [...this.with._current, ...args];

        const next = (...a)=>{
            const k = i++, l = a.length; 
            a = a.concat(args); a.splice(l, l);
            return this[k] ? this[k](next, ...a) : a[0];
        };

        delete this.fit._current;

        return next();
    }
}

export default jet.define("RunPool", RunPool, {
    copy:x=>(new RunPool(...x)).autoFilter(x.autoFilter._current).autoSort(x.autoSort._current),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    entries:x=>x.entries(),
});