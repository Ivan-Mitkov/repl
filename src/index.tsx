import * as esbuild from "esbuild-wasm";
import React from "react";
import ReactDOM from "react-dom";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpk-path-plugin";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
const App: React.FC = () => {
  const ref = React.useRef<any>();
  const [input, setInput] = React.useState("");
  const [code, setCode] = React.useState("");

  React.useEffect(() => {
    startService();
  }, []);

  //https://esbuild.github.io/api/#running-in-the-browser
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  const handleValueChange = (value: string) => {
    setInput(value);
  };
  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!ref.current) {
      return;
    }

    //https://esbuild.github.io/api/#build-api
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [
        //first find the paths
        unpkgPathPlugin(),
        //then fetch the data
        fetchPlugin(input),
      ],
      //https://esbuild.github.io/api/#define
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });
    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1"
        onChange={(value: string) => handleValueChange(value)}
      ></CodeEditor>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
