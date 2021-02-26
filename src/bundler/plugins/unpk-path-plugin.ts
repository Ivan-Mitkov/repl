import * as esbuild from "esbuild-wasm";

//https://esbuild.github.io/plugins/#using-plugins
//override esbuild natural behaviour
export const unpkgPathPlugin = () => {
  return {
    //mainly for debugging
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //Where index.js is?
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });
      //search for ./ or ../
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          //https://developer.mozilla.org/en-US/docs/Web/API/URL
          // path: new URL(args.path, args.importer + "/").href,
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
        };
      });
      //handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
