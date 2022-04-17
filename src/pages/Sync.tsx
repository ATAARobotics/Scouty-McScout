import React from "react";

import { MatchInfo, writeMatch } from "../util/database";

interface HeaderProps {
	done: () => void;
	otherIps?: string[];
}

async function gatherInfo(): Promise<MatchInfo[]> {
	const info = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key) {
			const data = await localStorage.getItem(key);
			if (data !== null) {
				info.push(JSON.parse(data));
			}
		}
	}
	return info;
}

async function updateInfo(info: MatchInfo[]): Promise<boolean> {
	for (const match of info) {
		writeMatch(match);
	}
	return true;
}

const API_ENDPOINTS = [
	// Server McServerface
	"https://autoscout.ben1jen.ca:4431/",
	"http://autoscout.ben1jen.ca:4421/",
	// Scouting Pi
	"http://raspberry-mcpiface.lan:4421/",
	"http://raspberry-mcpiface.local:4421/",
	// Local
	"http://localhost:4421/",
];

export default function Sync(props: HeaderProps): JSX.Element {
	const [state, setState] = React.useState<
		| "starting"
		| "gathering"
		| "uploading"
		| "pulling"
		| "updating"
		| "failed"
		| "done"
	>("starting");
	const [error, setError] = React.useState<string | undefined>(undefined);
	React.useEffect(() => {
		setState("gathering");
		gatherInfo()
			.then((data) => {
				const encodedData = JSON.stringify(data);
				setState("uploading");
				return Promise.any(
					API_ENDPOINTS.concat(props.otherIps ?? []).map((endpoint) =>
						fetch(endpoint.replace(/\/$/, "") + "/api/push", {
							method: "PUT",
							body: encodedData,
						})
							.then((response) => {
								if (!response.ok || response.status !== 200) {
									throw new Error(
										"Push HTTP response bad with status " +
											response.status.toString(),
									);
									return;
								}
								return response.json();
							})
							.then((response) => {
								if (response === undefined) {
									throw new Error("Empty Response");
								}
								if (!response.success) {
									throw new Error(
										"Push failed with error: " + response.error,
									);
								}
								setState("pulling");
								return fetch(endpoint.replace(/\/$/, "") + "/api/pull");
							})
							.then((response) => {
								if (response === undefined) {
									throw new Error("Empty Response");
								}
								if (!response.ok || response.status !== 200) {
									throw new Error(
										"Pull HTTP response bad with status " +
											response.status.toString(),
									);
								}
								return response.json();
							})
							.then((response) => {
								if (response === undefined) {
									throw new Error("Empty Response");
								}
								if (!response.success || !response.data) {
									throw new Error(
										"Pull failed with error: " + response.error,
									);
								}
								return updateInfo(response.data);
							})
							.then((result) => {
								if (result === false) {
									throw new Error("Updating new info failed.");
								}
								if (result === undefined) {
									throw new Error("failed");
								}
								setState("done");
								props.done();
							}),
					),
				);
			})
			.catch((err) => {
				setError(err.errors.join("\n"));
				setState("failed");
			});
	}, []);
	if (state === "failed") {
		return (
			<div>
				<p>Failed to Sync!</p>
				<p>{`Error: ${error}`}</p>
				<button onClick={props.done}>Back</button>
			</div>
		);
	} else {
		return (
			<div>
				<p>{`Syncing ${state}...`}</p>
			</div>
		);
	}
}
