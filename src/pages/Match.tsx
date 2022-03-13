import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NumberLine from "../components/NumberLine";
import TextBox from "../components/TextBox";
import Choice from "../components/Choice";
import Switch from "../components/Switch";
import NumberUpDown from "../components/NumberUpDown";

import {
	MatchInfo,
	MatchType,
	ClimbLevel,
	readMatch,
	writeMatch,
} from "../util/database";

const style = StyleSheet.create({
	outer: {
		backgroundColor: "#262626",
		flexDirection: "column",
		padding: 24,
	},
	inner: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-around",
	},
	header: {
		fontSize: 24,
		marginTop: 24,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: "#e6e6e6",
		color: "#ffffff",
	},
	text: {
		fontSize: 24,
		color: "#ffffff",
	},
});

/**
 *
 */
const defaultState: MatchInfo = {
	type: "match_info",
	match: 0,
	matchCategory: "qualification",
	team: 0,
	auto: {
		exitedTarmac: false,
		startingLocation: "middle",
		cellsAcquired: 0,
		lowGoalAttempts: 0,
		lowGoalShots: 0,
		highGoalAttempts: 0,
		highGoalShots: 0,
	},
	teleop: {
		cellsAcquired: 0,
		lowGoalAttempts: 0,
		lowGoalShots: 0,
		highGoalAttempts: 0,
		highGoalShots: 0,
	},
	climb: {
		startedBeforeEndgame: false,
		highestAttempted: 0,
		highestScored: 0,
		fell: false,
	},
	speed: 2,
	stability: 2,
	defence: undefined,
	isPrimaryDefence: false,
	wasDisabled: false,
	wasBroken: false,
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

	return (
		<View style={style.outer}>
			<Text style={style.header}>General</Text>
			<View style={style.inner}>
				<Text style={style.text}>{saved}</Text>
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
			</View>
			<Text style={style.header}>
				<b>ATTENTION</b>! Ensure the above match information is correct{" "}
				<b>before</b> entering <b>any</b> information below.
			</Text>

			<Text style={style.header}>Autonomous</Text>
			<View style={style.inner}>
				<Switch
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, exitedTarmac: s },
						})
					}
					state={state.auto.exitedTarmac}
					label="Exited Tarmac"
				/>
				<Choice
					options={["Left", "Middle", "Right"]}
					label="Starting Location"
				/>
			</View>
			<View style={style.inner}>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, cellsAcquired: s },
						})
					}
					state={state.auto.cellsAcquired}
					label="Cells Picked Up"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, lowGoalAttempts: s },
						})
					}
					state={state.auto.lowGoalAttempts}
					label="Attempted Low Goal Shots"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, lowGoalShots: s },
						})
					}
					state={state.auto.lowGoalShots}
					label="Cells in Low Goal"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, highGoalAttempts: s },
						})
					}
					state={state.auto.highGoalAttempts}
					label="Attempted High Goal Shots"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, highGoalShots: s },
						})
					}
					state={state.auto.highGoalShots}
					label="Cells in High Goal"
				/>
			</View>
			<Text style={style.header}>Teleop</Text>
			<View style={style.inner}>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, cellsAcquired: s },
						})
					}
					state={state.teleop.cellsAcquired}
					label="Cells Picked Up"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, lowGoalAttempts: s },
						})
					}
					state={state.teleop.lowGoalAttempts}
					label="Attempted Low Goal Shots"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, lowGoalShots: s },
						})
					}
					state={state.teleop.lowGoalShots}
					label="Cells in Low Goal"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, highGoalAttempts: s },
						})
					}
					state={state.teleop.highGoalAttempts}
					label="Attempted High Goal Shots"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, highGoalShots: s },
						})
					}
					state={state.teleop.highGoalShots}
					label="Cells in High Goal"
				/>
			</View>
			<Text style={style.header}>Climb</Text>
			<View style={style.inner}>
				<Switch
					setState={(s) =>
						setState({
							...state,
							climb: { ...state.climb, startedBeforeEndgame: s },
						})
					}
					state={state.climb.startedBeforeEndgame}
					label="Started Before Endgame"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							climb: {
								...state.climb,
								highestAttempted: (s || 0) as ClimbLevel,
							},
						})
					}
					state={state.climb.highestAttempted}
					options={["None", "Low", "Medium", "High", "Traversal"]}
					label="Highest Level Attempted"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							climb: {
								...state.climb,
								highestScored: (s || 0) as ClimbLevel,
							},
						})
					}
					state={state.climb.highestScored}
					options={["None", "Low", "Medium", "High", "Traversal"]}
					label="Highest Level Scored"
				/>
				<Switch
					setState={(s) =>
						setState({ ...state, climb: { ...state.climb, fell: s } })
					}
					state={state.climb.fell}
					label="Fell Down"
				/>
			</View>
			<Text style={style.header}>General</Text>
			<View style={style.inner}>
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
			</View>
			<TextBox
				setState={(s) => setState({ ...state, notes: s })}
				state={state.notes}
				label="Notes and Comments"
			/>
			<Text style={style.header}></Text>
		</View>
	);
}
