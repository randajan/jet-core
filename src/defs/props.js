import Plex from "../class/extra/Plex";


export const add = (obj, property, val, writable=false, enumerable=false, overwrite=true)=>{ 
    if (jet.isMapable(property)) {
        jet.forEach(property, (f, i)=>{
            const n = String.jet.isNumeric(i);
            add(obj, n ? f : i, n ? val : f, writable, enumerable, overwrite)
        });
    } else if (!obj[property] || overwrite) {
        Object.defineProperty(obj, property, { value:val, writable, configurable:writable, enumerable });
    }
    return obj;
};

export const get = (obj, property)=>{
    if (!property) { property = Array.from(Object.getOwnPropertyNames(obj)); }
    if (!jet.isMapable(property)) { return obj[property]; }
    const props = {};
    jet.forEach(property, k=>props[k]=obj[k]);
    return props;
};

export const solid = new Plex(
    (obj, name, value, enumerable=true)=>Object.defineProperty(obj, name, { enumerable, value}),
    {
        all:(obj, namedValues, enumerable=true)=>{
            for (const [name, value] of Object.entries(namedValues)) {
                solid(obj, name, value, enumerable);
            }
            return obj;
        }
    }
);

export const virtual = new Plex(
    (obj, name, get, enumerable=true)=>Object.defineProperty(obj, name, { enumerable, get}),
    {
        all:(obj, namedGets, enumerable=true)=>{
            for (const [name, get] of Object.entries(namedGets)) {
                virtual(obj, name, get, enumerable);
            }
            return obj;
        }
    }
);

export const safe = new Plex(
    (obj, priv, name, set, get, enumerable=true)=>{
        return Object.defineProperty(obj, name, {
            set:set ? v=>priv[name] = set(v, priv[name], name) : undefined,
            get:get ? _=>get(priv[name], name) : _=>priv[name],
            enumerable
        });
    },
    {
        all:(obj, priv, namedSetsAndGets, enumerable=true)=>{
            for (const [name, { set, get }] of Object.entries(namedSetsAndGets)) {
                safe(obj, priv, name, set, get, enumerable);
            }
            return obj;
        }
    }
);

export const cached = new Plex(
    (obj, priv, name, set, enumerable=true)=>{
        return safe(obj, priv, name, null, v=>v != null ? v : (priv[name] = set(name)), enumerable)
    },
    {
        all:(obj, priv, namedSets, enumerable=true)=>{
            for (const [name, set] of Object.entries(namedSets)) {
                cached(obj, priv, name, set, enumerable);
            }
            return obj;
        }
    }
);
