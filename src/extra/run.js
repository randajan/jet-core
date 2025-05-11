import { isIterable, isRunnable, values } from "../defs/tools";



const _run = (any, args, res=[])=>{
    if (isRunnable(any)) { return any(...args); }
    if (!isIterable(any)) { return undefined; }
    for (const val of values(any)) { _run(val, args, res); }
    return res;
}

export const run = (any, ...args)=>_run(any, args);