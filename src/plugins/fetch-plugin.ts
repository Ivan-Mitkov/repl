import * as esbuild from "esbuild-wasm";
import localForage from "localforage";
import axios from "axios";

//create cache for packages
//https://localforage.github.io/localForage/
//https://localforage.github.io/localForage/#multiple-instances-createinstance
const fileCache = localForage.createInstance({
  name: "filecache",
});
export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      //load index.js
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      //helper function for caching
      //if onLoad doesn't return a result the execution is passed to the next loader
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //check to see if we have already fetched this file and if it is in the cache
        const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        //if it is, return it immediately
        if (cacheResult) {
          return cacheResult;
        }
        return null;
      });

      //load css files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        //replace new line char,escape " and '
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        //put css in js file
        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });

      // load js files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        //store response in cache
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
