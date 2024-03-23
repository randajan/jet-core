


export const buffer = (processQueue, bufferMs=100, maxQueueMs=0, maxQueueSize=0)=>{
    if (!jet.isRunnable(processQueue)) { throw new Error("jet.buffer(...) require function as a first argument"); }
    bufferMs = Math.max(0, Number.jet.to(bufferMs));
    maxQueueMs = Math.max(0, Number.jet.to(maxQueueMs));
    maxQueueSize = Math.max(0, Number.jet.to(maxQueueSize));

    let intA, intB, queue = [];

    const execute = _=>{
        clearTimeout(intA);
        clearTimeout(intB);
        const q = queue;
        queue = [];
        processQueue(q);
    };
    

    return (...args)=>{
        clearTimeout(intA);
        if (maxQueueSize && queue.length >= maxQueueSize) { return execute(); }
        queue.push(args);
        intA = setTimeout(execute, bufferMs);
        if (maxQueueMs > bufferMs && queue.length === 1) {
            intB = setTimeout(execute, maxQueueMs);
        }
    }
}