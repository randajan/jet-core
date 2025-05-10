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

const getByInst = (any, def)=>{
    if (def.is(any)) { return def; }
}

const findByProto = (any, proto)=>{
    const list = byPrototype.get(proto);
    
    if (!list) { return; }
    if (list.length === 1) { return getByInst(any, list[0]); }
    for (const def of list) {
        const r = getByInst(any, def);
        if (r) { return r; }
    }
}

const findByInst = (any, strict)=>{
    if (any == null) { return; }
    if (strict) { return findByProto(any, any.__proto__); }
    let r, p = any;
    do { r = findByProto(any, p = p.__proto__); }
    while (p && r === undefined);
    return r;
}

export const getDefByInst = (any, strict=true)=>findByInst(any, strict);
export const jet = (any, strict=true)=>findByInst(any, strict)?.type.name;

export const register = (def)=>{
    const { name, self } = def.type;
    const prot = self.prototype;
    byName.set(name, def);
    const list = byPrototype.get(prot);
    if (list) { list.unshift(def); }
    else { byPrototype.set(prot, [def]); }
}

export default new Proxy({}, {
    get: (_, name) =>getDefByName(name, true).type,
    has: (_, name) =>!!getDefByName(name),
    set: (_, name) =>fail(`types can't be defined this way. Use jet.define('${name}', ...) instead`),
    deleteProperty: _=>fail(`types can't be deleted`),
    ownKeys: _ => [...byName.keys()],
    getOwnPropertyDescriptor: (_, name) => ({
        enumerable: true,
        configurable: true,
        value: getDefByName(name).type
    })
});