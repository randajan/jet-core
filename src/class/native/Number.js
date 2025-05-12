
import { define } from "../../defs/tools";
import { _str } from "./String";
import { warn } from "../../defs/statics";
import { anyToFn } from "@randajan/function-parser";

let _nocryptoflag = false;
const strongRandom = () => {
    if (!_nocryptoflag) {
        if (typeof crypto !== "undefined") {
            if (crypto.getRandomValues) {
                const a = new Uint32Array(1);
                crypto.getRandomValues(a);
                return a[0] / 2**32;
            }
            if (crypto.randomBytes) {
                return crypto.randomBytes(4).readUInt32LE() / 2**32;
            }
        } else {
            _nocryptoflag = true;
            warn("missing crypto module = weaker random generator");
        }
    }

    return Math.random(); // fallback
};

export const _num = define("num", {
    self: Number,
    create: Number,
    rnd: (min, max, sqr) => {
        let r = strongRandom();
        sqr = sqr === true ? 2 : sqr === false ? -2 : _num.is(sqr) ? sqr : 0;
        if (sqr) { r = Math.pow(r, sqr < 0 ? -sqr : 1 / sqr); }
        return _num.fromRatio(r, min || 0, max || min || 1);
    }
}).defineTo({
    arr: (num, comma) => comma != null ? [num] : Array(num),
    bool: num => !!num,
    date: num => new Date(num),
    err: bol=>new Error(String(bol)),
    fn: anyToFn,
    //map,
    //num,
    //obj,
    set: num => new Set([num]),
    str: num => String(num),
    sym: num => Symbol(num)
}).extend({
    x: (num1, symbol, num2) => {
        const s = symbol, nums = _num.zoomIn(num1, num2), [n, m] = nums;
        if (s === "/") { return n / m; }
        if (s === "*") { return n * m / Math.pow(nums.zoom, 2); }
        return (s === "+" ? n + m : s === "-" ? n - m : s === "%" ? n % m : NaN) / nums.zoom;
    },
    frame: (num, min, max) => {
        num = max == null ? num : Math.min(num, max);
        return min == null ? num : Math.max(num, min);
    },
    round: (num, dec, kind) => {
        const k = Math.pow(10, dec || 0);
        return Math[kind == null ? "round" : kind ? "ceil" : "floor"](num * k) / k;
    },
    len: (num, bol) => {
        const b = bol, s = _str.to(num), l = s.length, i = s.indexOf("."), p = (i >= 0);
        return (b === false ? (p ? l - i - 1 : 0) : ((!p || !b) ? l : i));
    },
    period: (val, min, max) => { const m = max - min; return (m + (val - min) % m) % m + min; },
    toRatio: (num, min, max) => { const m = max - min; return m ? (num - min) / m : 0; },
    fromRatio: (num, min, max) => { const m = max - min; return num * m + min; },
    zoomIn: (...nums) => {
        const zoom = Math.pow(10, Math.max(...nums.map(num => _num.len(num, false))));
        const res = nums.map(num => Math.round(num * zoom));
        return Object.defineProperty(res, "zoom", { value:zoom });
    },
    zoomOut: (...nums) => nums.map(num => num / nums.zoom),
    diffusion: (num, min, max, diffusion) => {
        const d = num * diffusion;
        return _num.rnd(Math.max(min, num - d), Math.min(max, num + d));
    },
    snap: (num, step, min, max, ceil, frame = true) => {
        var v = num, s = step, n = min, m = max, ni = (n != null), mi = (m != null), c = ceil;
        if (v == null || s == null || s <= 0 || !(ni || mi)) { return v; } else if (frame) { v = _num.frame(v, n, m); }
        var r = ni ? v - n : m - v; v = (r % s) ? ((ni ? n : m) + (_num.round(r / s, 0, c == null ? null : c === ni) * s * (ni * 2 - 1))) : v; //snap
        return (frame ? (_num.frame(v, n, m)) : v); //frame
    },
    whatpow: (num, base) => Math.log(num) / Math.log(_num.to(base)),
    toHex: num => { var r = Math.round(num).toString(16); return r.length === 1 ? "0" + r : r; },
    toLetter: (num, letters) => {
        letters = _str.to(letters) || "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const len = letters.length;
        return (num >= len ? _num.toLetter(Math.floor(num / len) - 1) : '') + letters[num % len];
    }
});


define("nan", {
    self:Number,
    create:_=>NaN,
    is:isNaN
}).defineTo(
    _=>undefined
)