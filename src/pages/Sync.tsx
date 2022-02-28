import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { MatchInfo, writeMatch } from "../util/database";

const style = StyleSheet.create({
	view: {
		flex: 1,
	},
	text: {
		fontSize: 32,
		color: "#ffffff",
	},
});

interface HeaderProps {
	done: () => void;
	otherIps?: string[];
}

async function gatherInfo(): Promise<MatchInfo[]> {
	const info = [];
	for (const key of await AsyncStorage.getAllKeys()) {
		const data = await AsyncStorage.getItem(key);
		if (data !== null) {
			info.push(JSON.parse(data));
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
	// Local
	"http://localhost:4421/",
	// Scouting Pi
	"http://raspberry-mcpiface.lan:4421/",
	"http://raspberry-mcpiface.local:4421/",
	"http://192.168.4.10:4421/",
	// Server McServerface
	"http://autoscout.ben1jen.ca:4421/",
	"https://autoscout.ben1jen.ca:4431/",
];

export default function Sync(props: HeaderProps): JSX.Element {
	console.log("other ips:", props.otherIps);
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
						}),
					),
				);
			})
			.then((response) => {
				if (!response.ok || response.status !== 200) {
					setError(
						"Push HTTP response bad with status " +
							response.status.toString(),
					);
					return;
				}
				return response.json();
			})
			.then((response) => {
				if (response === undefined) {
					return;
				}
				if (!response.success) {
					setError("Push failed with error: " + response.error);
					return;
				}
				setState("pulling");
				return Promise.any(
					API_ENDPOINTS.concat(props.otherIps ?? []).map((endpoint) =>
						fetch(endpoint.replace(/\/$/, "") + "/api/pull"),
					),
				);
			})
			.then((response) => {
				if (response === undefined) {
					return;
				}
				if (!response.ok || response.status !== 200) {
					setError(
						"Pull HTTP response bad with status " +
							response.status.toString(),
					);
					return;
				}
				return response.json();
			})
			.then((response) => {
				if (response === undefined) {
					return;
				}
				if (!response.success || !response.data) {
					setError("Push failed with error: " + response.error);
					return;
				}
				return updateInfo(response.data);
			})
			.then((result) => {
				if (result === false) {
					setError("Updating new info failed.");
					result = undefined;
					return;
				}
				if (result === undefined) {
					setState("failed");
					return;
				}
				setState("done");
				props.done();
			})
			.catch((err) => {
				console.error("Catch: ", err);
				setError(err.message);
				setState("failed");
			});
	}, []);
	if (state === "failed") {
		return (
			<View>
				<Text style={style.text}>Failed to Sync!</Text>
				<Text style={style.text}>{`Error: ${error}`}</Text>
				<Button title="Back" onPress={props.done} />
			</View>
		);
	} else {
		return (
			<View>
				<Text style={style.text}>{`Syncing ${state}...`}</Text>
			</View>
		);
	}
}
