import React from "react";

interface NumberUpDownProps {
	label: string;
	setState?: (state: number) => void;
	state?: number;
	className?: string;
}

/**
 * @param props
 */
export default function NumberUpDown(props: NumberUpDownProps): JSX.Element {
	const [value, setValueRaw] = React.useState(props.state ?? 0);
	const setValue = (newValue: number) => {
		if (props.setState) {
			props.setState(newValue);
		}
		setValueRaw(newValue);
	};
	const actualValue = props.state ?? value;
	return (
		<div>
			<p>{props.label}</p>
			<div className={props.className}>
				<button
					className="dec-button"
					onClick={() => setValue(Math.max(actualValue - 1, 0))}
				>
					-
				</button>
				<input
					type="number"
					onChange={(ev) => {
						let value = ev.target.value;
						if (value === "") {
							value = "0";
						}
						const number = parseInt(value);
						if (!isNaN(number)) {
							setValue(Math.min(Math.max(number, 0), 100));
						}
					}}
					value={actualValue.toString()}
				/>
				<button
					className="inc-button"
					onClick={() => setValue(Math.min(actualValue + 1, 100))}
				>
					+
				</button>
			</div>
		</div>
	);
}
