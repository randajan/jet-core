import { warn } from "./statics";

let _cryptonit;
const createGenerator = ()=>{
    if (typeof crypto !== "undefined") {
        if (crypto.getRandomValues) {
            return _ => {
                const a = new Uint32Array(1);
                crypto.getRandomValues(a);
                return a[0] / 2 ** 32;
            }
        } else if (crypto.randomBytes) {
            return _ => crypto.randomBytes(4).readUInt32LE() / 2 ** 32;
        }
    }

    warn("missing crypto module = weaker random number generator");
    return _ => Math.random();
};

export const numRnd = () => {
    return (_cryptonit || (_cryptonit = createGenerator()))()
}

export const bolRnd = (ratio=.5)=>numRnd() >= ratio;