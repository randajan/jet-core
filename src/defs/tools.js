import { factory, getDefByInst, getTypeByInst, touchBy } from "./statics";

export const isFilled = any => getTypeByInst(any).isFilled(any);
export const isBlank = any => !isFilled(any);
export const isIterable = any => getTypeByInst(any).isIterable;
export const isRunnable = any => typeof any === "function";
export const copy = any => getDefByInst(any).copy(any);
export const filled = (...a) => factory(null, 0, ...a);
export const keys = (any, throwError = false) => touchBy(any, "keys", throwError) || [];
export const values = (any, throwError = false) => touchBy(any, "values", throwError) || [];
export const entries = (any, throwError = false) => touchBy(any, "entries", throwError) || [];
export const get = (any, key, throwError = false) => touchBy(any, "get", throwError, key);
export const set = (any, key, val, throwError = false) => touchBy(any, "set", throwError, key, val);
export const del = (any, key, throwError = true) => touchBy(any, "del", throwError, key);