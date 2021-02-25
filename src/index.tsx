import * as esbuild from "esbuild-wasm";
import React from "react";
import ReactDOM from "react-dom";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpk-path-plugin";
import CodeEditor from "./components/CodeEditor";

const App: React.FC = () => {
  const ref = React.useRef<any>();
  const iframe = React.useRef<any>();
  const [input, setInput] = React.useState("");

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
    //update iframe to default before new code
    iframe.current.srcdoc = html;
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
    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  const html = `
  <html>
  <head></head>
  <body>
    <div id="root"></div>
    <script>
      window.addEventListener('message',(event)=>{
        try{
          eval(event.data)
        }catch(error){
          const root=document.querySelector('#root')
          root.innerHTML='<div style="color:red"><h4>Runtime error </h4>' + error + '</div>'
          throw error;
        }
      },false)
    </script>
  </body>
</html>   
  `;
  return (
    <div>
      <CodeEditor></CodeEditor>
      <textarea onChange={handleChange} value={input}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        sandbox="allow-scripts"
        srcDoc={html}
        title="my-iframe"
        ref={iframe}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
