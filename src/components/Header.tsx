import React from "react";

import { clearData } from "../util/database";

export type PageState = "match" | "pit" | "sync";

interface HeaderProps {
	setPage: (page: PageState) => void;
	setIps: (ips: string[]) => void;
}

export default function Header(props: HeaderProps): JSX.Element {
	const [ip, setIp] = React.useState("");
	React.useEffect(() => {
		if (ip === undefined || ip === "") {
			props.setIps([]);
		} else {
			props.setIps([ip]);
		}
	}, [ip]);
	return (
		<div className="header">
			<img src="/ataa.png" />
			<button onClick={() => props.setPage("match")}>Match</button>
			<button onClick={() => props.setPage("pit")}>Pit</button>
			<button onClick={() => props.setPage("sync")}>Send Data</button>
			<input
				value={ip}
				onChange={(ev) => setIp(ev.target.value)}
				placeholder="Other server IP"
			></input>
			<button
				className="danger-button"
				onClick={() => {
					if (confirm("Are you sure you want to clear ALL local data?")) {
						clearData();
					}
				}}
			>
				Clear Data (local)
			</button>
		</div>
	);
}
