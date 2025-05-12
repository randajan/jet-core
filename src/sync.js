import { jet } from "./defs";

import { _getRnd, getRnd } from "./extra/rnd.js";
import { createEnum } from "./extra/enum.js";
import { json } from "./extra/json.js";
import { run } from "./extra/run.js";

import { Plex } from "./class/self/Plex.js";
import { Iterable } from "./class/self/Iterable.js";

import { _str } from "./class/native/String.js";
import { _num } from "./class/native/Number.js";
import "./class/native/*";


//must be here to prevent loop
Iterable.prototype.getRnd = function (any, min, max, sqr) {
    return _getRnd(this.values(any), min, max, sqr);
}

export default jet;
export {
    jet,
    run,
    getRnd,
    createEnum,
    json,
    Plex,
}

export * from "./defs/tools.js";