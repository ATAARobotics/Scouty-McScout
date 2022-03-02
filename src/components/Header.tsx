import React from "react";
import { Image, Button, View, StyleSheet, TextInput } from "react-native";

import { clearData } from "../util/database";

const style = StyleSheet.create({
	main: {
		flex: 1,
		flexDirection: "row",
		height: 100,
		backgroundColor: "#404050",
	},
	image: {
		height: 100,
		width: 140,
	},
	text: {
		color: "#ffffff",
		width: 200,
		borderRadius: 6,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "#ffffff",
	},
});

export type PageState = "match" | "sync";

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
		<View style={style.main}>
			<Image source={require("../../assets/ataa.png")} style={style.image} />
			<Button title="Match" onPress={() => props.setPage("match")} />
			{/* <Button title="Pit" onPress={() => props.setPage("pit")} />*/}

			<Button title="Sync" onPress={() => props.setPage("sync")} />
			<TextInput
				style={style.text}
				value={ip}
				onChangeText={setIp}
				placeholder="Other server IP"
			></TextInput>
			<Button
				color="#ff0000"
				title="Clear Data (local)"
				onPress={() => {
					if (confirm("Are you sure you want to clear ALL local data?")) {
						clearData();
					}
				}}
			>
				Clear All Data
			</Button>
		</View>
	);
}
