import jet from "../jet";

export default jet.define("Function", Function, {
    create:Function,
    copy:x=>Object.defineProperties(({[x.name]:(...a)=>x(...a)})[x.name], Object.getOwnPropertyDescriptors(x)),
    to:{
        "*":(fce, ...args)=>fce(...args),
        Promise:async (fce, ...args)=>await fce(...args),
    },
});