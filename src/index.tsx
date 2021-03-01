import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { store } from "./state";
import CodeCell from "./components/CodeCell";
import TextEditor from "./components/TextEditor";
import CellList from "./components/CellList";
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList></CellList>
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
