import { anyToFn } from "@randajan/function-parser";
import { numRnd } from "../../defs/crypt";
import { _str } from "./String";
import { Definition } from "../self/Definition";
import { strToNum, symToStr } from "../../defs/convert";



export const _num = Definition.createType("num", {
    self: Number,
    create: Number,
    isFilled: x => !!x,
    copy: num => num,
    rand: (min, max, sqr) => {
        let r = numRnd();
        sqr = sqr === true ? 2 : sqr === false ? -2 : _num.is(sqr) ? sqr : 0;
        if (sqr) { r = Math.pow(r, sqr < 0 ? -sqr : 1 / sqr); }
        return _num.fromRatio(r, min || 0, max || min || 1);
    },
}).defineFrom({
    //arr,
    //fn,
    //obj,
    str:strToNum,
    bol: v => +v,
    dt: v => v.getTime(),
    //err,
    //map,
    //rgx,
    //set,
    sym:v => strToNum(symToStr(v))
}).addTools({
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
        return Object.defineProperty(res, "zoom", { value: zoom });
    },
    zoomOut: (...nums) => nums.map(num => num / nums.zoom),
    diffusion: (num, min, max, diffusion) => {
        const d = num * diffusion;
        return _num.rand(Math.max(min, num - d), Math.min(max, num + d));
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


Definition.createType("nan", {
    self: Number,
    create: _ => NaN,
    is: isNaN
});