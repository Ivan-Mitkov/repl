import React from "react";
import ReactDOM from "react-dom";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
import bundler from "./bundler";

const App: React.FC = () => {
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
