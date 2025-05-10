import slib, { argv } from "@randajan/simple-lib";
import ImportGlobPlugin from 'esbuild-plugin-import-glob';

slib(
    argv.isBuild,
    {
        minify:false,
        plugins:[
            ImportGlobPlugin.default()
        ],
        lib:{
            entries:[
                "index.js",
                "class/extra/Promise.js",
                "class/extra/Ticker.js",
                "class/extra/RunPool.js",
                "class/extra/Pool.js",
                "class/extra/Plex.js",
                "each/eachAsync.js",
                "each/eachSync.js",
            ]
        }
    }
)