import { fail, getDefByName, getTypeByInst, getTypesList } from "./statics";


export const jet = new Proxy(getTypeByInst, {
    get: (_, name) =>getDefByName(name, true).type,
    has: (_, name) =>!!getDefByName(name),
    set: (_, name) =>fail(`types can't be defined this way. Use define('${name}', ...) instead`),
    deleteProperty: _=>fail(`types can't be deleted`),
    ownKeys: getTypesList,
    getOwnPropertyDescriptor: (_, name) => ({
        enumerable: true,
        configurable: true,
        value: getDefByName(name).type
    })
});
