import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

console.log("Running");

/**
 * Render the app.
 */
function render() {
	ReactDOM.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
		document.getElementById("root"),
	);
}

window.addEventListener("load", render);
