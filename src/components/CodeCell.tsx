import React from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import bundler from "../bundler";
import Resizable from "./Resizable";
import { Direction } from "../enums";

const CodeCell: React.FC = () => {
  const [input, setInput] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleValueChange = (value: string) => {
    setInput(value);
  };

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      const bundeledCode = await bundler(input);
      setCode(bundeledCode);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction={Direction.vertical}>
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction={Direction.horisontal}>
          <CodeEditor
            initialValue="import React from 'react';
                        import ReactDOM from 'react-dom';
                        const App=()=><h1>Hi</h1>;
                        ReactDOM.render(<App/>,document.querySelector('#root') )"
            onChange={(value: string) => handleValueChange(value)}
          ></CodeEditor>
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
