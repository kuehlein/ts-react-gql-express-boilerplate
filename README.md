boilerplate for typescript react gql express project

# DO NOT DO THIS:

## OPTIMIZATION ---

### Do not connect client to server (or vice versa) through imports:

-tsc will compile all files connected via import
-using hmr, only client side is recompiled to save time
-by connecting client and server via imports, tsc will recompile everything

### Do not watch server while using HMR

-using a tool that restarts the server (like nodemon) will significantly impact the preformance of HMR

# --------------------------------------------------------------------------

# --------------------------------------------------------------------------

# TO DO:

-should i use a prettier config?

# --------------------------------------------------------------------------

# --------------------------------------------------------------------------

#CONTROL FLOW
_development and prododuction_

---

TRANSPILE:
-./config/webpack.dev.config.ts
-./server/index.ts
-./server/server/ts

RUN:
-./public/dist/ts-sourcemap/server/index.js
|
V
-./public/dist/ts-sourcemap/server/server.js
|
V
-./public/dist/ts-sourcemap/webpack.config.js
|
TSC + <----------excecuting webpack.config
BUNDLE
|
V
WAIT ON SERVER <------webpack finishes, server resumes
|
V
SERVER FINISHES <-----server finishes executing
CREATING APP +
SERVES BUNDLE <------server statically serves bundle

---

CHANGES MADE: (client)
-react-hot-loader detects changes ???
-tells webpack to recompile / rebundle changed modules
-swaps out modules in current bundle without affecting state

CHANGES MADE: (server)
-hmr does not work well with something that restarts servers
-changes will not be detected
-will have to restart

# --------------------------------------------------------------------------

# --------------------------------------------------------------------------

server/server...

    // transpile options for rest of files (other than webpack.config + server/index + server/server)
    // const options: TranspileOptions = {
    //   compilerOptions: {
    //     allowSyntheticDefaultImports: true,
    //     alwaysStrict: true,
    //     esModuleInterop: true,
    //     module: tsc.ModuleKind.CommonJS,
    //     moduleResolution: tsc.ModuleResolutionKind.NodeJs,
    //     target: tsc.ScriptTarget.ES5
    //   }
    // };
