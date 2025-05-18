import { jet } from "./defs";

import { _getRand, getRand } from "./extra/rand.js";
import { createEnum } from "./extra/enum.js";
import { json } from "./extra/json.js";
import { run } from "./extra/run.js";

import { FnProxy } from "./class/self/FnProxy.js";
import { Iterable } from "./class/self/Iterable.js";

import { _str } from "./class/native/_String.js";
import { _num } from "./class/native/_Number.js";
import "./class/native/*";
import { melt } from "./extra/melt.js";


//must be here to prevent loop
Iterable.prototype.getRand = function (any, min, max, sqr) {
    return _getRand(this.values(any), min, max, sqr);
}

export default jet;
export {
    jet,
    run,
    getRand,
    createEnum,
    json,
    melt,
    FnProxy,
}

export * from "./defs/tools.js";