import * as esbuild from "esbuild-wasm";
import React from "react";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./plugins/unpk-path-plugin";

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
      wasmURL: "/esbuild.wasm",
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
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
      plugins: [unpkgPathPlugin()],
    });
    console.log('result',result);
    setCode(result.outputFiles[0].text);
  };
  return (
    <div>
      <textarea onChange={handleChange} value={input}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
