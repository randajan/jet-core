import { rgxLib } from "./regex";



export const strToNum = str => {
    if (!str) { return; }
    const match = str.replace(/\u00A0/g, ' ').match(rgxLib.number);
    if (!match || !match[0]) { return; }
    const n = Number(match[0].replaceAll(" ", "").replace(",", "."));
    if (!isNaN(n)) { return n; }
}


export const symToStr = sym => String(sym).slice(7, -1);


export const strToObj = str => {
    const obj = JSON.parse(str);
    if (typeof obj === "object") { return obj; }
    throw Error(`"${str}" is not valid JSON object`);
}

export const errToObj = err => {
    const plain = {};
    for (const key of Object.getOwnPropertyNames(err)) {
        plain[key] = err[key];
    }
    return plain;
}


const boolPats = /^(0*|f|(no?t?)|off|false|undefined|null|NaN)$/i;
export const strToBol = str => boolPats.test(str.trim());


export const numToDt = num => {
    const dt = new Date();
    dt.setTime(num);
    return dt;
}