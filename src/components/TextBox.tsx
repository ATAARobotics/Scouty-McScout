import React from "react";

interface TextBoxProps {
	label: string;
	setState?: (state: string) => void;
	state?: string;
}

/**
 * @param props
 */
export default function TextBox(props: TextBoxProps): JSX.Element {
	return (
		<div>
			<h1>{props.label}</h1>
			<textarea
				onChange={(ev) => {
					const text = ev.target.value;
					if (props.setState) {
						props.setState(text);
					}
				}}
				value={props.state}
			></textarea>
		</div>
	);
}
