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

const getByInst = (any, type, withDef=true)=>{
    if (type.def.is(any)) { return withDef ? type : type.name; }
}

const findByProto = (any, proto, withDef=true)=>{
    const list = byPrototype.get(proto);
    
    if (!list) { return; }
    if (list.length === 1) { return getByInst(any, list[0], withDef); }
    for (const type of list) {
        const r = getByInst(any, type, withDef);
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

export const register = type=>{
    const name = type.name;
    const prot = type.def.self.prototype;
    byName.set(name, type);
    const list = byPrototype.get(prot);
    if (list) { list.unshift(type); }
    else { byPrototype.set(prot, [type]); }
}

export const jet = getNameByInst;

export default new Proxy({}, {
    get: (_, name) =>getDefByName(name),
    has: (_, name) =>!!getDefByName(name),
    set: (_, name) =>fail(`types can't be defined this way. Use jet.define('${name}', ...) instead`),
    deleteProperty: _=>fail(`types can't be deleted`),
    ownKeys: _ => [...byName.keys()],
    getOwnPropertyDescriptor: (_, name) => ({
        enumerable: true,
        configurable: true,
        value: getDefByName(name)
    })
});