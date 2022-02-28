import React from "react";
import { Image, Button, View, StyleSheet, TextInput } from "react-native";

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
		width: 240,
		height: 24,
		borderRadius: 6,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "#ffffff",
		margin: 50,
	},
});

export type PageState = "match" | "sync";

interface HeaderProps {
	setPage: (page: PageState) => void;
}

export default function Header(props: HeaderProps): JSX.Element {
	const [ip, setIp] = React.useState<string>();
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
		</View>
	);
}
