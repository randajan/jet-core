import { NoDefinition } from "../class/self/NoDefinition";

const byName = new Map();
const byPrototype = new Map();

const _msg = (msg, name)=>`jet${name ? ` type '${name}'` : ""} ${msg}`;
export const fail = (msg, name, cause)=>{ throw new Error(_msg(msg, name), { cause }); }
export const warn = (msg, name)=>{ console.warn(_msg(msg, name)); }

export const getDefByName = (name, throwError=false)=>{
    const type = byName.get(name);
    if (type) { return type; }
    if (throwError) { fail(`undefined type '${name}'`); }
}

export const getTypesList = ()=>[...byName.keys()];

const getByInst = (any, def)=>{
    if (def.is(any)) { return def; }
}

const _undefined = new NoDefinition();
export const getDefByInst = any=>{
    if (any == null) { return _undefined; }
    const list = byPrototype.get(any.__proto__);
    if (!list || !list.length) { return _undefined; }
    if (list.length === 1) { 
        const r = getByInst(any, list[0]);
        if (r) { return r; }
    } else {
        for (const def of list) {
            const r = getByInst(any, def);
            if (r) { return r; }
        }
    }
    return _undefined;
}

export const getTypeByInst = any=>getDefByInst(any).type;

export const register = (def)=>{
    const { name, self } = def.type;
    const prot = self.prototype;
    byName.set(name, def);
    const list = byPrototype.get(prot);
    if (list) { list.unshift(def); }
    else { byPrototype.set(prot, [def]); }
}

export const touchBy = (any, op, throwError, ...args)=>{
    const type = getTypeByInst(any, false);

    if (type[op]) { return type[op](any, ...args); }
    if (!throwError) { return; }

    if (!type) { fail(`unable execute '${op}' - missing type of '${any}'`); }
    if (!type.isIterable) { fail(`undefined operation '${op}' - unavailable for this type`, type.name); }
}

//0 = filled, 1 = only, 2 = ensure, 3 = ensureCopy
export const factory = (type, mm, ...args)=>{
    for (const a of args) {
        const d = getDefByInst(a);
        if (type && type !== d.type) { continue; }
        if (mm === 0 && !d.isFilled(a)) { continue; }
        return (mm === 3) ? d.copy(a) : a;
    }
    if (type && mm > 1) { return type.create(); }
}

export const isFilled = any=>(any === false || any === 0 || !!any);
export const isFilleds = obj=>{
    for (let i in obj) { if (isFilled(obj[i])) { return true; }}
    return false;
}