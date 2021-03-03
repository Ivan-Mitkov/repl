### Browser use

example use:
in code cell
<code>

import React from "react";

import ReactDOM from "react-dom";


const App = () =>  < some html tag>  Hi </some html tag>;

ReactDOM.render(<App />, document.querySelector("#root"));

</code>

will render Hi in iframe

#### <pre> show( < some html tag> Hi </some html tag> ) </pre>

is equivalent to 

import React from "react";

import ReactDOM from "react-dom";

const App = () => < some html tag> Hi </some html tag>;

ReactDOM.render(<App />, document.querySelector("#root"));

if the arg of show() looks like JSX imports and render are done by the function


