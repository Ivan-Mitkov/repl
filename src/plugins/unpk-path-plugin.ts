import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

//create cache for packages
//https://localforage.github.io/localForage/
//https://localforage.github.io/localForage/#multiple-instances-createinstance
const fileCache = localForage.createInstance({
  name: "filecache",
});

//https://esbuild.github.io/plugins/#using-plugins
//override esbuild natural behaviour
export const unpkgPathPlugin = (inputCode: string) => {
  return {
    //mainly for debugging
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //Where index.js is?
      // Intercept import paths with ".*" so esbuild doesn't attempt
      // to map them to a file system location. Tag them with the "a"
      // namespace to reserve them for this plugin.
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }
        if (args.path.includes("./") || args.path.includes("../")) {
          return {
            namespace: "a",
            //https://developer.mozilla.org/en-US/docs/Web/API/URL
            // path: new URL(args.path, args.importer + "/").href,
            path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`)
              .href,
          };
        }
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
      // if esbuild is attempting to load index.js don't do the normal think return if{}
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }
        //check to see if we have already fetched this file and if it is in the cache
        const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        //if it is, return it immediately
        if (cacheResult) {
          return cacheResult;
        }
        const { data, request } = await axios.get(args.path);
        //store response in cache

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
