import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import { store } from "./state";
import CodeCell from "./components/CodeCell";
import TextEditor from "./components/TextEditor";
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <TextEditor />
        <CodeCell />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
