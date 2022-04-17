import React from "react";

interface ChoiceProps {
	options: string[];
	label: string;
	setState?: (state: number | undefined) => void;
	state?: number;
}

/**
 * @param props
 */
export default function Choice(props: ChoiceProps): JSX.Element {
	const [choice, setChoice] = React.useState<number>();
	return (
		<div className="item-container">
			<p className="label">{props.label}</p>
			<div className="buttons">
				{props.options.map((label, index) => (
					<button
						key={index}
						className={`${
							index ===
							(props.state === undefined ? choice : props.state)
								? "button-press"
								: "button-unpress"
						} ${
							index === 0
								? "border-left"
								: index === props.options.length - 1
								? "border-right"
								: ""
						}`}
						onClick={() => {
							if (props.setState !== undefined) {
								props.setState(index);
							}
							setChoice(index);
						}}
					>
						<p className="button-text">{label}</p>
					</button>
				))}
			</div>
		</div>
	);
}
