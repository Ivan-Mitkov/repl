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
  const onClick = async () => {
    const bundeledCode = await bundler(input);
    setCode(bundeledCode);
  };

  return (
    <Resizable direction={Direction.vertical}>
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction={Direction.horisontal}>
          <CodeEditor
            initialValue="const a = 1"
            onChange={(value: string) => handleValueChange(value)}
          ></CodeEditor>
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
