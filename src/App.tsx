import React from "react";
import { PageState } from "./components/Header";
import Header from "./components/Header";
import Match from "./pages/Match";
import Sync from "./pages/Sync";
import Pit from "./pages/Pit";

function renderPage(
	state: PageState,
	setState: (state: PageState) => void,
	ips: string[] | undefined,
): JSX.Element {
	switch (state) {
		case "match":
			return <Match />;
		case "pit":
			return <Pit />;
		case "sync":
			return <Sync done={() => setState("match")} otherIps={ips} />;
		// Pit scouting isn't a thing this year :)
		// case "pit":
		// 	return <Pit />;
	}
}

export default function App(): JSX.Element {
	const [state, setState] = React.useState<PageState>("match");
	const [ips, setIps] = React.useState<string[]>();
	return (
		<div className="main">
			<Header setPage={setState} setIps={setIps} />
			{renderPage(state, setState, ips)}
		</div>
	);
}
