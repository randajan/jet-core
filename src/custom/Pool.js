import jet from "../jet";

class Pool extends Array {

    static pass(from, to, start, length=1) {
        if (!Array.isArray(from)) { throw "Pool.pass 'from' require array"; }
        if (!Array.isArray(to)) { throw "Pool.pass 'to' require array" }
        return to.push(...from.splice(start, length)) >= 0;
    }

    has(item) { return this.includes(item); }

    add(...items) {
        this.splice(-1, 0, ...items);
        return _=>this.remove(...items);
    }
    remove(...items) {
        return this.filter(v=>!items.includes(v));
    }

    push(...items) {
        this.splice(-1, 0, ...items);
        return this;
    }
    unshift(...items) {
        this.splice(0, 0, ...items);
        return this;
    }

    put(start, ...items) {
        this.splice(start, 0, ...items);
        return this;
    }

    splice(start, length=1, ...items) {
        let result;
        if (length < 0) { length = 0; }
        if (start < 0) { start = Math.max(0, this.length+start+1-length); }
        if (items.length) {
            const autoFilter = this.autoFilter._current, autoSort = this.autoSort._current;
            items = items.flat();
            if (autoFilter) { items = items.filter(autoFilter); }
            if (start === this.length) { super.push(...items); }
            else if (start === 0) { super.unshift(...items); }
            else { result = super.splice(start, length, ...items); }
            if (autoSort) { this.sort(autoSort); }
        }
        else if (length > 0) { result = super.splice(start, length); } //remove only

        return result || new Pool();
    }

    passTo(to, start, length=1) { return Pool.pass(this, to, start, length); }
    passFrom(from, start, length=1) { return Pool.pass(from, this, start, length); }

    flush() {
        return super.splice(0, this.length);
    }

    filter(fce) {
        let k = 0;
        for (let i=0; i<this.length; i++) {
            if (fce(this[i], i, this)) { this[k++] = this[i]; }
        }
        this.length = k;
        return this;
    }

    map(fce) {
        const r = [];
        for (let i=this.length-1; i>=0; i--) {
            r.push(fce(this[i], i, this));
        }
        return r;
    }

    autoFilter(fce) {
        if (!jet.isRunnable(fce)) { delete this.autoFilter._current; } else {
            this.autoFilter._current = fce;
            this.filter(fce);
        }
        return this;
    }

    autoSort(fce) {
        if (!jet.isRunnable(fce)) { delete this.autoSort._current; } else {
            this.autoSort._current = fce;
            this.sort(fce);
        }
        return this;
    }

    toString(separator=" ") {
        return jet.melt(this, String.jet.to(separator, this));
    }
}

export default jet.define("Pool", Pool, {
    copy:x=>(new Pool(...x)).autoFilter(x.autoFilter._current).autoSort(x.autoSort._current),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    entries:x=>x.entries(),
});