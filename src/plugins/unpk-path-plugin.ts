import * as esbuild from "esbuild-wasm";
import axios from "axios";
//https://esbuild.github.io/plugins/#using-plugins
//override esbuild natural behaviour
export const unpkgPathPlugin = () => {
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
            path: new URL(args.path, args.importer + "/").href,
          };
        }
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
        // else if (args.path === "tiny-test-pkg") {
        //   return {
        //     path: "https://unpkg.com/tiny-test-pkg@1.0.0/index.js",
        //     namespace: "a",
        //   };
        // }
      });
      // if esbuild is attempting to load index.js don't do the normal think return if{}
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              import message from 'medium-test-pkg';
              console.log(message);
            `,
          };
        }
        const { data } = await axios.get(args.path);
        console.log(data);
        return {
          loader: "jsx",
          contents: data,
        };
      });
    },
  };
};
