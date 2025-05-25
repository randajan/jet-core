import { _arr } from "./Array";

export const _set = _arr.extend("set", {
    self: Set,
    isFilled: x=>!!x.size,
    copy: x => new Set(x),
    keys: x => [...x.keys()],
    values: x => [...x.values()],
    entries: x => [...x.entries()],
    get: (x, k) => x.has(k) ? k : undefined,
    set: (x, k, v) => x.add(v) ? v : undefined,
    del: (x, k) => x.del(k),
    from: set=>[...set],
    to: arr=>new Set(arr)
}).defineFrom({
    //arr:,
    //bol:,
    //dt:,
    //err:,
    //fn:,
    //map:,
    //num:,
    //obj:,
    //rgx:,
    //set:,
    //str:,
    //sym:
})