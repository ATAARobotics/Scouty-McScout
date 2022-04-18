import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("Running");

/**
 * Render the app.
 */
function render() {
	const root = document.getElementById("root");
	if (root === null) {
		alert("Can't find root element to build website!");
		return;
	}
	createRoot(root).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}

window.addEventListener("load", render);
