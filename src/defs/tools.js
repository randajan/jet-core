import { Definition } from "../class/self/Definition";
import { factory, getTypeByInst, touchBy } from "./statics";

export const isFull = (any, strict = true) => getTypeByInst(any, strict).isFull(any);
export const isIterable = (any, strict = true) => getTypeByInst(any, strict).isIterable;
export const isRunnable = any => typeof any === "function";
export const full = (...a) => factory(null, 0, ...a);
export const keys = (any, throwError = false) => touchBy(any, "keys", throwError) || [];
export const values = (any, throwError = false) => touchBy(any, "values", throwError) || [];
export const entries = (any, throwError = false) => touchBy(any, "entries", throwError) || [];
export const get = (any, key, throwError = false) => touchBy(any, "get", throwError, key);
export const set = (any, key, val, throwError = false) => touchBy(any, "set", throwError, key, val);
export const rem = (any, key, throwError = true) => touchBy(any, "rem", throwError, key);
export const define = (name, definition) => Definition.create(name, definition).type;
