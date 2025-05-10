export const enumFactory = (enums, {before, after, def}={})=>(raw, ...args)=>{
    const input = before ? before(raw, ...args) : raw;
    const output = enums.includes(input) ? input : def;
    
    return after ? after(output, ...args) : output;
}