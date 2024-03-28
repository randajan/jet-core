import slib from "@randajan/simple-lib";


slib(
    process.env.NODE_ENV !== "dev",
    {
        minify:false,
        entries:["index.js", "extra/Ticker.js", "extra/RunPool.js", "extra/Pool.js"]
    }
)