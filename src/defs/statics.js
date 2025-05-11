import { Undefined } from "../class/self/Undefined";

const byName = new Map();
const byPrototype = new Map();

const _msg = (msg, name)=>`jet${name ? ` type '${name}'` : ""} ${msg}`;
export const fail = (msg, name)=>{ throw _msg(msg, name); }
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

const _undefined = new Undefined();
const findByProto = (any, proto)=>{
    const list = byPrototype.get(proto);
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

export const getDefByInst = (any, strict=true)=>{
    if (any == null) { return _undefined; }
    if (strict) { return findByProto(any, any.__proto__); }
    let r, p = any;
    do { r = findByProto(any, p = p.__proto__); }
    while (p && r === undefined);
    return r || _undefined;
}

export const getTypeByInst = (any, strict=true)=>getDefByInst(any, strict).type;

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

//0 = full, 1 = only, 2 = tap, 3 = pull
export const factory = (type, mm, ...args)=>{
    for (const a of args) {
        const t = getTypeByInst(a);
        if (type && type !== t) { continue; }
        if (mm === 0 && !t.isFull(a)) { continue; }
        return (t.copy && mm === 3) ? t.copy(a) : a;
    }
    if (type && mm > 1) { return type.create(); }
}
