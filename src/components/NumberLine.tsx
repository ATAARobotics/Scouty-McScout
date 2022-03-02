import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const style = StyleSheet.create({
	container: {
		flexDirection: "column",
		marginRight: 12,
		alignItems: "center",
	},
	label: {
		color: "#ffffff",
	},
	text: {
		color: "#ffffff",
		width: 240,
		height: 24,
		borderRadius: 6,
		borderStyle: "solid",
		borderWidth: 2,
		borderColor: "#ffffff",
	},
});

interface NumberLineProps {
	label: string;
	setState?: (state: number | undefined) => void;
	state?: number;
}

/**
 * @param props
 */
export default function NumberLine(props: NumberLineProps): JSX.Element {
	const [number, setNumber] = React.useState<number>();
	return (
		<View style={style.container}>
			<Text style={style.label}>{props.label}</Text>
			<TextInput
				style={style.text}
				keyboardType="numeric"
				onChangeText={(value) => {
					if (value === "") {
						if (props.setState) {
							props.setState(undefined);
						} else {
							setNumber(undefined);
						}
					} else {
						const number = parseInt(value);
						if (!isNaN(number)) {
							if (props.setState) {
								props.setState(number);
							} else {
								setNumber(number);
							}
						}
					}
				}}
				placeholder={props.label}
				value={
					props.state === undefined
						? number === undefined
							? ""
							: number.toString()
						: props.state.toString()
				}
			></TextInput>
		</View>
	);
}
