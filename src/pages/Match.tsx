import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
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
});

/**
 *
 */
const defaultState: MatchInfo = {
	type: "match_info",
	match: undefined,
	matchCategory: undefined,
	team: undefined,
	auto: {
		exitedTarmac: false,
		startingLocation: undefined,
		cellsAcquired: 0,
		cellsDropped: 0,
		lowGoalShots: 0,
		highGoalShots: 0,
	},
	teleop: {
		cellsAcquired: 0,
		cellsDropped: 0,
		lowGoalShots: 0,
		highGoalShots: 0,
	},
	climb: {
		startedBeforeEndgame: false,
		highestAttempted: 0,
		highestScored: 0,
		fell: false,
	},
	speed: undefined,
	stability: undefined,
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

	return (
		<View style={style.outer}>
			<Text style={style.header}>General</Text>
			<View style={style.inner}>
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
							auto: { ...state.auto, cellsDropped: s },
						})
					}
					state={state.auto.cellsDropped}
					label="Cells Dropped"
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
							teleop: { ...state.teleop, cellsDropped: s },
						})
					}
					state={state.teleop.cellsDropped}
					label="Cells Dropped"
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
					setState={(s) => setState({ ...state, speed: s })}
					state={state.speed}
					options={["1", "2", "3", "4", "5"]}
					label="Speedyboi"
				/>
				<Choice
					setState={(s) => setState({ ...state, stability: s })}
					state={state.stability}
					options={["1", "2", "3", "4", "5"]}
					label="Stability"
				/>
				<Choice
					setState={(s) => setState({ ...state, defence: s })}
					state={state.defence}
					options={["1", "2", "3", "4", "5"]}
					label="Defence"
				/>
				<Switch
					setState={(s) => setState({ ...state, isPrimaryDefence: s })}
					state={state.isPrimaryDefence}
					label="Primary Defence Bot?"
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
			<Button
				title="Save"
				onPress={() =>
					writeMatch(state).then((success) =>
						console.log("Wrote the match: ", success),
					)
				}
			/>
			<Text style={style.header}></Text>
		</View>
	);
}
