import React from "react";
import ReactDOM from "react-dom";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import CodeCell from "./components/CodeCell";
import TextEditor from "./components/TextEditor";
const App: React.FC = () => {
  return (
    <div>
      <TextEditor />
      <CodeCell />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
