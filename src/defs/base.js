import Plex from "../class/extra/Plex";

const byName = {};
const byPrototype = new Map();
const constructorByName = {};

const defaultThrow = (msg, name)=>`jet${name ? ` type '${name}'` : ""} ${msg}`;
export const throwError = (msg, name)=>{ throw defaultThrow(msg, name); }
export const throwWarn = (msg, name)=>{ console.warn(defaultThrow(msg, name)); }

export const getDefByName = name=>byName[name];
export const getDefByProto = prototype=>{
    const list = byPrototype.get(prototype);
    return list ? list[0] : undefined;
}

const getByInst = (any, def, withDef=true)=>{
    if (!def.is || def.is(any)) { return withDef ? def : def.name; }
}

const findByProto = (any, proto, withDef=true)=>{
    const list = byPrototype.get(proto);
    if (!list) { return; }
    if (list.length === 1) { return getByInst(any, list[0], withDef); }
    for (const def of list) {
        const r = getByInst(any, def, withDef);
        if (r) { return r; }
    }
}

const findByInst = (any, strict, withDef=true)=>{
    if (any == null) { return; }
    if (strict) { return findByProto(any, any.__proto__, withDef); }
    let r, p = any;
    do { r = findByProto(any, p = p.__proto__, withDef); }
    while (p && r === undefined);
    return r;
}

export const getDefByInst = (any, strict=true)=>findByInst(any, strict, true);

export const getNameByInst = (any, strict=true)=>findByInst(any, strict, false);


export const register = def=>{
    byName[def.name] = def;
    Object.defineProperty(constructorByName, def.name, {enumerable:true, value:def.constructor});
    const list = byPrototype.get(def.prototype);
    if (list) { list.unshift(def); }
    else { byPrototype.set(def.prototype, [def]); }
}

export default new Plex(getNameByInst, {
    types:constructorByName,
});
