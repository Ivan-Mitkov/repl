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
      // if esbuild is attempting to load index.js don't do the normal think return if{}
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: inputCode,
          };
        }
        // //check to see if we have already fetched this file and if it is in the cache
        // const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
        //   args.path
        // );
        // //if it is, return it immediately
        // if (cacheResult) {
        //   return cacheResult;
        // }
        const { data, request } = await axios.get(args.path);
        //loading CSS files
        const fileType = args.path.match(/.css$/) ? "css" : "jsx";
        //replace new line char,escape " and '
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        //put css in js file
        const contents =
          fileType === "css"
            ? `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `
            : data;
        //loaders for files

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        //store response in cache

        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
