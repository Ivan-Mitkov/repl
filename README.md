### Browser use

example use:
in code cell

import React from "react";
import ReactDOM from "react-dom";

const App = () => <div>Hi</div>;
ReactDOM.render(<App />, document.querySelector("#root"));

will render Hi in iframe

#### <pre>show(<div>Hi</div>)</pre>

is equivalent to if the arg of show() looks like JSX imports and render are done by the function

import React from "react";
import ReactDOM from "react-dom";

const App = () => <div>Hi</div>;
ReactDOM.render(<App />, document.querySelector("#root"));




