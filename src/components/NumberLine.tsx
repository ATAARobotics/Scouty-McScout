import React from "react";

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
		<div>
			<p>{props.label}</p>
			<input
				onChange={(ev) => {
					const value = ev.target.value;
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
							? 0
							: number
						: props.state
				}
			></input>
		</div>
	);
}
