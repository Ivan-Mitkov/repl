import * as esbuild from "esbuild-wasm";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpk-path-plugin";

let service: esbuild.Service;
const bundler = async (rawCode: string) => {
  if (!service) {
    //https://esbuild.github.io/api/#running-in-the-browser

    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }
  //https://esbuild.github.io/api/#build-api
  const result = await service.build({
    entryPoints: ["index.js"],
    bundle: true,
    write: false,
    plugins: [
      //first find the paths
      unpkgPathPlugin(),
      //then fetch the data
      fetchPlugin(rawCode),
    ],
    //https://esbuild.github.io/api/#define
    define: {
      "process.env.NODE_ENV": '"production"',
      global: "window",
    },
  });

  return result.outputFiles[0].text;
};

export default bundler;
