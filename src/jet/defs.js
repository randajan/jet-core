import Plex from "./Plex";

const byName = {};
const byConstructor = new Map();
const constructorByName = {};

const defaultThrow = (msg, name)=>`jet${name ? ` type '${name}'` : ""} ${msg}`;
export const throwError = (msg, name)=>{ throw defaultThrow(msg, name); }
export const throwWarn = (msg, name)=>{ console.warn(defaultThrow(msg, name)); }

export const getDefByName = name=>byName[name];
export const getDefByConst = constructor=>{
    const list = byConstructor.get(constructor);
    return list ? list[0] : undefined;
}

const getByInst = (any, all=false, withDefinition=false)=>{
    const r = all ? [] : undefined;
    if (any == null) { return r; }
    const list = byConstructor.get(any.constructor);
    if (!list) { return r; }
    for (const def of list) {
        if (def.is && !def.is(any)) { continue; }
        const e = withDefinition ? def : def.name;
        if (r) { r.push(e) } else { return e; }
    }
    return r;
}

export const getDefByInst = (any, all=false)=>getByInst(any, all, true);
export const getNameByInst = (any, all=false)=>getByInst(any, all, false);

export const register = def=>{
    byName[def.name] = def;
    Object.defineProperty(constructorByName, def.name, {enumerable:true, value:def.constructor});
    const list = byConstructor.get(def.constructor);
    if (list) { list.unshift(def); }
    else { byConstructor.set(def.constructor, [def]); }
}

//jet init
export default new Plex(getNameByInst, {
    types:constructorByName
})