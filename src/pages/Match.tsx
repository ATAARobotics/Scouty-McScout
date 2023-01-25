import React from "react";
import NumberLine from "../components/NumberLine";
import TextBox from "../components/TextBox";
import Choice from "../components/Choice";
import Switch from "../components/Switch";
import NumberUpDown from "../components/NumberUpDown";

import {
	MatchInfo,
	MatchType,
	ClimbLevel,
	ShooterPositions,
	readMatch,
	writeMatch,
} from "../util/database";

/*
Auto:
Pre loaded
Mobility
Hybrid
Cone Medium
Cone High
Cube Medium
Cube High
Off/On/Balanced station
Someone on team balanced (get from blue alliance?)

Teleop:
Hybrid
Cone Medium
Cone High
Cube Medium
Cube High
Normal Park
Off/On/Balanced station

General:
Speedyboi
Stability
Defence
Broke/Disconnected
Notes


 */
const defaultState: MatchInfo = {
	type: "match_info",
	match: 0,
	matchCategory: "qualification",
	team: 0,
	auto: {
		exitedTarmac: false,
		chargeStation: "off",
		hybridScored: 0,
		middleCubeScored: 0,
		middleConeScored: 0,
		highCubeScored: 0,
		highConeScored: 0,
	},
	teleop: {
		hybridScored: 0,
		middleCubeScored: 0,
		middleConeScored: 0,
		highCubeScored: 0,
		highConeScored: 0,
		parked: false,
		chargeStation: "off",
	},
	
	speed: 2,
	stability: 2,
	defence: undefined,
	isPrimaryDefence: false,
	wasBroken: false,
	wasDisabled: false,
	notes: "",
	lastModifiedTime: 0,
};
export default function Match(): JSX.Element {
	const [matchCategory, setMatchCategory] = React.useState<MatchType>();
	const [matchNumber, setMatchNumber] = React.useState<number>();
	const [teamNumber, setTeamNumber] = React.useState<number>();
	const [state, setStateRaw] = React.useState<MatchInfo>(defaultState);
	React.useEffect(() => {
		if (
			matchCategory !== undefined &&
			matchNumber !== undefined &&
			teamNumber !== undefined
		) {
			readMatch(matchNumber, matchCategory, teamNumber).then((match) => {
				if (match !== undefined) {
					setStateRaw(match);
				} else {
					setStateRaw({
						...defaultState,
						matchCategory,
						match: matchNumber,
						team: teamNumber,
					});
				}
			});
		}
	}, [matchCategory, matchNumber, teamNumber]);

	const setState = (newState: MatchInfo) => {
		newState.lastModifiedTime = Date.now();
		console.log("State: ", newState);
		setStateRaw(newState);
	};

	const [saved, setSaved] = React.useState<"saved" | "saving" | "error">(
		"saved",
	);
	React.useEffect(() => {
		setSaved("saving");
		writeMatch(state).then((success) => {
			if (success) {
				setSaved("saved");
			} else {
				setSaved("error");
			}
		});
	}, [state]);

	const choices = (
		<>
			<h1>
				<b>ATTENTION</b>! Ensure the above match information is correct{" "}
				<b>before</b> entering <b>any</b> information below.
			</h1>

			<h1>Autonomous</h1>
			<div className="inner">
				<Switch
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, exitedTarmac: s },
						})
					}
					state={state.auto.exitedTarmac}
					label="Exited Tarmac (Tape in the Center)"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							auto: {
								...state.auto,
								chargeStation: ["off", "on", "balanced"][
									s ?? 0
								] as "off" | "on" | "balanced",
							},
						})
					}
					state={
						state.auto.chargeStation === "off"
							? 0
							: state.auto.chargeStation === "on"
							? 1
							: state.auto.chargeStation === "balanced"
							? 2
							: undefined
					}
					options={["Off", "On", "Balanced"]}
					label="Charge Station (Balance Board)"
				/> 
				
			</div>
			<div className="inner">
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, hybridScored: s },
						})
					}
					state={state.auto.hybridScored}
					label="Scored in Low Goal (auto)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, middleCubeScored: s },
						})
					}
					state={state.auto.middleCubeScored}
					label="Cubes Scored in Middle Goal (auto)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, middleConeScored: s },
						})
					}
					state={state.auto.middleConeScored}
					label="Cones Scored in Middle Goal (auto)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, highCubeScored: s },
						})
					}
					state={state.auto.highCubeScored}
					label="Cubes scored in High Goal (auto)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, highConeScored: s },
						})
					}
					state={state.auto.highConeScored}
					label="Cones scored in High Goal (auto)"
				/>
			</div>
			<h1>Teleop</h1>
			<div className="inner">
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, hybridScored: s },
						})
					}
					state={state.teleop.hybridScored}
					label="Scored in Low Goal (teleop)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, middleCubeScored: s },
						})
					}
					state={state.teleop.middleCubeScored}
					label="Cubes scored in Medium Goal (teleop)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, middleConeScored: s },
						})
					}
					state={state.teleop.middleConeScored}
					label="Cones scored in Medium Goal (teleop)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, highCubeScored: s },
						})
					}
					state={state.teleop.highCubeScored}
					label="Cubes scored in High Goal (teleop)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, highConeScored: s },
						})
					}
					state={state.teleop.highConeScored}
					label="Cones scored in High Goal (teleop)"
				/>
				<Switch
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, parked: s },
						})
					}
					state={state.teleop.parked}
					label="Parked (Within tape)"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							teleop: {
								...state.teleop,
								chargeStation: ["off", "on", "balanced"][
									s ?? 0
								] as "off" | "on" | "balanced",
							},
						})
					}
					state={
						state.teleop.chargeStation === "off"
							? 0
							: state.teleop.chargeStation === "on"
							? 1
							: state.teleop.chargeStation === "balanced"
							? 2
							: undefined
					}
					options={["Off", "On", "Balanced"]}
					label="Charge Station (Balance Board) (Teleop final park)"
				/> 
			</div>
			<h1>Ratings</h1>
			<div className="inner">
				<Choice
					setState={(s) => setState({ ...state, speed: s ?? 2 })}
					state={state.speed}
					options={["1", "2", "3", "4", "5"]}
					label="Speedyboi"
				/>
				<Choice
					setState={(s) => setState({ ...state, stability: s ?? 2 })}
					state={state.stability}
					options={["1", "2", "3", "4", "5"]}
					label="Stability"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							defence:
								s === undefined
									? undefined
									: s === 0
									? undefined
									: s - 1,
						})
					}
					state={state.defence === undefined ? 0 : state.defence + 1}
					options={["None", "1", "2", "3", "4", "5"]}
					label="Defence"
				/>
				
				<Switch
					setState={(s) => setState({ ...state, wasBroken: s })}
					state={state.wasBroken}
					label="Did Anything Break?"
				/>
				<Switch
					setState={(s) => setState({ ...state, wasDisabled: s })}
					state={state.wasDisabled}
					label="Robot Died, Disabled, or Disconnected?"
				/>
			</div>
			<TextBox
				setState={(s) => setState({ ...state, notes: s })}
				state={state.notes}
				label="Notes and Comments"
			/>
		</>
	);

	return (
		<div className="outer">
			<h1>General</h1>
			<div className="inner">
				<div className="item-container">
					<p>Status:</p>
					<p className="status">
						{saved[0].toUpperCase() + saved.substring(1)}
					</p>
				</div>
				<Choice
					options={["Practice", "Qualification"]}
					setState={(n) => {
						switch (n) {
							case 0:
								setMatchCategory("practice");
								break;
							case 1:
								setMatchCategory("qualification");
								break;
						}
					}}
					state={
						matchCategory === undefined
							? undefined
							: matchCategory === "practice"
							? 0
							: 1
					}
					label="Match Type"
				/>
				<NumberLine
					setState={setMatchNumber}
					state={matchNumber}
					label="Match Number"
				/>
				<NumberLine
					setState={setTeamNumber}
					state={teamNumber}
					label="Team Number"
				/>
			</div>
			{matchCategory !== undefined &&
			matchNumber !== undefined &&
			matchNumber !== 0 &&
			teamNumber !== undefined &&
			teamNumber !== 0 ? (
				choices
			) : (
				<h1>
					Please fill out the match information above <b>completely</b> and{" "}
					<b>correctly</b> before entering information.
				</h1>
			)}
		</div>
	);
}
