import { fnToStr } from "@randajan/function-parser";
import { define } from "../../defs/tools";

export const _fn = define("fn", {
    self: Function,
    create: Function,
    copy: x => Object.defineProperties(({ [x.name]: (...a) => x(...a) })[x.name], Object.getOwnPropertyDescriptors(x)),
}).defineTo({
    "*": (fce, ...args) => fce(...args),
    str:fnToStr
}).extend({
    benchmark: (fces, inputs, iterations = 100) => {
        const results = [];
        const args = [];
        for (let i = 0; i < iterations; i++) { args[i] = inputs.map(f => f()); }

        for (const key in fces) {
            const fce = fces[key];
            if (typeof fce !== 'function') { continue; }
            const log = [];
            const startTime = performance.now();
            for (let i = 0; i < iterations; i++) { log.push({ inputs: args[i], output: fce(...args[i]) }); }
            const endTime = performance.now();
            const duration = endTime - startTime;
            results.push({ name: fce.name || key, duration, log });
        }

        return results.sort((a, b) => a.duration - b.duration);
    }
})