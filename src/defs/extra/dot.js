import jet from "../base";

const isBlank = str=>str == null || str === "";
const noBlank = str=>isBlank(str) ? "" : str;

export const escape = str=>str.replaceAll(".", "\\.");
export const unescape = str=>str.replaceAll("\\.", ".");
export const split = str=>(str.match(/(?:\\.|[^.])+/g) || []).map(unescape);

export const bite = (str, direction, position)=>{
    const dir = direction !== false;
    const x = dir ? str.indexOf(".", position) : str.lastIndexOf(".", position);
    if (x <= 0) { return [str, ""]; }
    if (x > 1 && str.charAt(x-1) === "\\") { return bite(str, dir, x+(dir*2-1)); }
    return direction ? [str.slice(0, x), str.slice(x + 1)] : [str.slice(x + 1), str.slice(0, x)];
}

export const biteLeft = (str, position)=>bite(str, true, position);
export const biteRight = (str, position)=>bite(str, false, position);

export const glue = (strA, strB)=>{
    if (isBlank(strA)) { return noBlank(strB); }
    if (isBlank(strB)) { return noBlank(strA); }

    return strA + "." + strB;
}

export const toString = any=>jet.melt(any, ".");
export const toArray = any=>split(toString(any));
