import { anyToFn } from "@randajan/function-parser";
import { isRunnable } from "../../defs/tools";
import { _fn } from "./_Function";
import { numRnd } from "../../defs/crypt";
import { Definition } from "../self/Definition";

export const _arr = Definition.createType("arr", {
    self: Array,
    create: Array,
    isFilled: x =>!!x?.length,
    copy: x => Array.from(x),
    keys: x => [...x.keys()],
    values: x => [...x.values()],
    entries: x => [...x.entries()],
}).defineTo({
    bol: arr => !!arr.length,
    fn: anyToFn,
    rgx: (arr, comma) => new RegExp(arr.join(comma ?? "|")), //TODO
    err: (arr, comma) => arr.join(comma ?? " "),
    str: (arr, comma) => arr.join(comma ?? ""),
}).addTools({
    swap: (arr, to, from) => {//swap position of two items in array
        [arr[to], arr[from]] = [arr[from], arr[to]];
        return arr;
    },
    shuffle: (arr) => {//shuffle whole array
        for (let i = arr.length - 1; i > 0; i--) {_arr.swap(arr, Math.floor(numRnd() * (i + 1)), i); }
        return arr;
    },
    clean: (arr, rekey, handler) => {
        handler = _fn.ensure(handler, v => v != null);
        return rekey !== false ? arr.filter(handler) : arr.map(v => handler(v) ? v : undefined);
    },
    compare: (a, b, sameIndex = false) => {
        if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) { return false; }
        const m = new Map();
        const wr = (v, dir) => {
            const c = (m.get(v) || 0) + dir;
            if (!c) { m.delete(v); } else { m.set(v, c); }
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i] === b[i]) { continue; }
            if (sameIndex) { return false; }
            wr(a[i], 1);
            wr(b[i], -1);
        }

        return !m.size;
    },
    sliceMap: (arr, size, callback) => {
        if (!isRunnable(callback)) { callback = _ => _; }
        size = Math.max(1, size) || 1;
        const r = [];
        if (!Array.isArray(arr)) { return r; }
        for (let k = 0; k < arr.length; k += size) { r.push(callback(arr.slice(k, k + size), r.length, size, arr.length)); }
        return r;
    }
})