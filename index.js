import slib, { argv } from "@randajan/simple-lib";


slib(
    argv.isBuild,
    {
        minify:false,
        entries:["index.js", "extra/Ticker.js", "extra/RunPool.js", "extra/Pool.js"]
    }
)