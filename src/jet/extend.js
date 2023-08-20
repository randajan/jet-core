import jet, { getDefByName, throwError } from "./defs";


const _prototypeExtenders = {};

const enumerable = true;
const _extend = (name, isNative, key, val, jc, jp)=>{
    const rnbl = typeof val === "function";
    if (jp) { Object.defineProperty(jp, key, {enumerable, value:rnbl ? function(...a) { return val(this.___, ...a); } : val}); }
    if (jc) { Object.defineProperty(jc, key, {enumerable, value:val}); }
    if (isNative && jet[key]) { Object.defineProperty(jet[key], name, {enumerable, value:val}); }
}

export const defineExtend = (name, extendConstructor={}, extendPrototype={}, isNative=false)=>{
    const def = getDefByName(name);
    if (!def) { throwError(`unable define 'extend' - type unknown`, name); }
    const c = def.constructor;
    const p = c.prototype;

    const ec = extendConstructor === false ? null : typeof extendConstructor === "object" ? extendConstructor : {};
    const ep = extendPrototype === false ? null : typeof extendPrototype === "object" ? extendPrototype : {};

    let jc = c.jet, jp = _prototypeExtenders[name];

    if (ep && !jp) {
        jp = _prototypeExtenders[name] = {};
        Object.defineProperty(p, "jet", { get:function() { return {___:this, ...jp} } });
    }

    if (jc) { for (const k in ec) { _extend(name, isNative, k, ec[k], jc); } }
    if (jp) { for (const k in ep) { _extend(name, isNative, k, ep[k], jc, jp); } }

    return true;
}