
import jet from "./jet";
import Object from "./native/Object.js";
import Boolean from "./native/Boolean.js";
import Number from "./native/Number.js";
import String from "./native/String.js";
import Symbol from "./native/Symbol";
import Function from "./native/Function";
import RegExp from "./native/RegExp.js";
import Date from "./native/Date.js";
import NaN from"./native/NaN.js";
import Error from "./native/Error.js";
import Promise from "./native/Promise.js";
import Array from "./native/Array.js";
import Set from "./native/Set.js";
import Map from "./native/Map.js";
import Pool from "./extra/Pool.js";
import RunPool from "./extra/RunPool.js";


export default jet;
export const Plex = jet.types.Plex;


export {
    Object,
    Boolean,
    Number,
    String,
    Symbol,
    Function,
    RegExp,
    Date,
    NaN,
    Error,
    Promise,
    Array,
    Set,
    Map,
    RunPool,
    Pool
}