import { fnToStr } from "@randajan/function-parser";
import { Definition } from "../self/Definition";


export const _fn = Definition.createType("fn", {
    self: Function,
    create: Function,
    copy: x => Object.defineProperties(({ [x.name]: (...a) => x(...a) })[x.name], Object.getOwnPropertyDescriptors(x)),
}).defineTo({
    "*":fn=>fn(),
    str:fnToStr,
}).addTools({
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