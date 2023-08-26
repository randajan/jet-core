import jet from "../jet";

export default jet.define("Array", Array, {
    create:Array,
    copy:x=>Array.from(x),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    entries:x=>x.entries(),
    to:{
        Function:arr=>_=>arr,
        Boolean:arr=>Array.jet.isFull(arr),
        Number:arr=>arr.length,
        String:(arr, comma)=>jet.melt(arr, comma),
        Object:arr=>Object.assign({}, arr),
        Promise: async arr=>arr,
        Error:(arr, comma)=>jet.melt(arr, comma != null ? comma : " "),
        RegExp:(arr, comma)=>jet.melt(arr, comma != null ? comma : "|")
    },
    extendPrototype:{
        swap:(arr, to, from)=>{//swap position of two items in array
            [arr[to], arr[from]] = [arr[from], arr[to]];
            return arr;
        },
        shuffle:(arr)=>{//shuffle whole array
            for (let i = arr.length - 1; i > 0; i--) {Array.jet.swap(arr, Math.floor(Math.random() * (i + 1)), i);}
            return arr;
        },
        clean:(arr, rekey, handler)=>{
            handler = Function.jet.tap(handler, v=>v!=null);
            return rekey !== false ? arr.filter(handler) : arr.map(v=>handler(v) ? v : undefined);
        },
        remap: (arr, mapper, ...orderBy)=>{
            let result, stopped;
            const stop = res=>{ stopped = true; return res; };
            const remap = (val, key)=>stopped ? undefined : mapper ? mapper(val, key, stop) : val;

            if (!orderBy.length) { result = arr.map(remap); } else {
                const obs = orderBy.map(ob=>Array.isArray(ob) ? ob : [ob, true]);
                const expand = arr.map(val=>([ val, obs.map(ob=>ob[0](val)) ]));
    
                const sorted = expand.sort(([aV, aO], [bV, bO]) => {
                    for (const k in obs) {
                        const aS = aO[k], bS = bO[k];
                        if (aS === bS) { continue; }
                        const dir = (typeof aS !== "string" && typeof bS !== "string") ? aS < bS : String.jet.fight(aS, bS) === aS;
                        const asc = obs[k][1];
                        return (dir !== asc) * 2 - 1;
                    }
                    return 0;
                });

                result = sorted.map(([val], key)=>remap(val, key));
            }

            return result.filter(v=>v!==undefined);
        },
        remapAsync: async (arr, mapper, ...orderBy)=>{
            let result, stopped;
            const stop = res=>{ stopped = true; return res; };
            const remap = (val, key)=>stopped ? undefined : mapper ? mapper(val, key, stop) : val;

            if (!orderBy.length) { result = arr.map(remap); } else {
                const obs = orderBy.map(ob=>Array.isArray(ob) ? ob : [ob, true]);
                const expand = await Promise.all(arr.map(async val=>([ val, await Promise.all(obs.map(ob=>ob[0](val))) ])));
    
                const sorted = expand.sort(([aV, aO], [bV, bO]) => {
                    for (const k in obs) {
                        const aS = aO[k], bS = bO[k];
                        if (aS === bS) { continue; }
                        const dir = (typeof aS !== "string" && typeof bS !== "string") ? aS < bS : String.jet.fight(aS, bS) === aS;
                        const asc = obs[k][1];
                        return (dir !== asc) * 2 - 1;
                    }
                    return 0;
                });

                result = sorted.map(([val], key)=>remap(val, key));
            }

            return (await Promise.all(result)).filter(v=>v!==undefined);
        }
    }
});