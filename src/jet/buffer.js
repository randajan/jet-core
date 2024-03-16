


export const buffer = (processQueue, bufferMs=100, maxQueueSize=100)=>{
    if (!jet.isRunnable(processQueue)) { throw new Error("jet.buffer(...) require function as a first argument"); }
    bufferMs = Math.max(0, Number.jet.to(bufferMs));
    maxQueueSize = Math.max(0, Number.jet.to(maxQueueSize));

    let int, queue = [];

    const execute = _=>{
        const q = queue;
        queue = [];
        processQueue(q);
    };

    return (...args)=>{
        clearTimeout(int);
        if (maxQueueSize && queue.length >= maxQueueSize) { return execute(); }
        queue.push(args);
        int = setTimeout(execute, bufferMs);
    }
}