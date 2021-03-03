### Browser use

example use:
in code cell
<pre>

import React from "react";

import ReactDOM from "react-dom";


const App = () =>  \< h1>  Hi \<\/h1>;

ReactDOM.render( \<  App \/\>, document.querySelector("#root"));

</pre>

will render Hi in iframe

#### <pre> show( \< h1> Hi \<\/h1> ) </pre>

is equivalent to 
<pre>
import React from "react";

import ReactDOM from "react-dom";

const App = () => \< h1> Hi \<\/h1>;

ReactDOM.render(\<App \/\>, document.querySelector("#root"));
</pre>
if the arg of show() looks like JSX imports and render are done by the function


