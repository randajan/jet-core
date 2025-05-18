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
                "sync.js",
            ],
            standalone:{
                entries:{"jetSync":"sync.js", "jetAsync":"index.js"},
                bundle:[
                  "@randajan/function-parser"
                ],
            }
        },
        
    }
);


/*
    "./plex": {
      "import": "./dist/esm/extra/Plex.mjs",
      "require": "./dist/cjs/extra/Plex.cjs"
    },
    "./pool": {
      "import": "./dist/esm/extra/Pool.mjs",
      "require": "./dist/cjs/extra/Pool.cjs"
    },
    "./runpool": {
      "import": "./dist/esm/extra/RunPool.mjs",
      "require": "./dist/cjs/extra/RunPool.cjs"
    },
    "./ticker": {
      "import": "./dist/esm/extra/Ticker.mjs",
      "require": "./dist/cjs/extra/Ticker.cjs"
    }
*/