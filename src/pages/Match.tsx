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

/**
 *
 */
const defaultState: MatchInfo = {
	type: "match_info",
	match: 0,
	matchCategory: "qualification",
	team: 0,
	auto: {
		preloadedCargo: false,
		exitedTarmac: false,
		startingLocation: "middle",
		cubesAcquired: 0,
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
	shooterPositions: 0,
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
								startingLocation: ["left", "middle", "right"][
									s ?? 0
								] as "left" | "middle" | "right",
							},
						})
					}
					state={
						state.auto.startingLocation === "left"
							? 0
							: state.auto.startingLocation === "middle"
							? 1
							: state.auto.startingLocation === "right"
							? 2
							: undefined
					}
					options={["Left", "Middle", "Right"]}
					label="Starting Location"
				/>
			</div>
			<div className="inner">
				<Switch
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, preloadedCargo: s },
						})
					}
					state={state.auto.preloadedCargo}
					label="Started with ball"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, cubesAcquired: s },
						})
					}
					state={state.auto.cubesAcquired}
					label="Cubes Picked Up (auto)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, lowGoalAttempts: s },
						})
					}
					state={state.auto.lowGoalAttempts}
					label="Balls Shot at Low Goal (auto)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, lowGoalShots: s },
						})
					}
					state={state.auto.lowGoalShots}
					label="Balls Landed in Low Goal (auto)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, highGoalAttempts: s },
						})
					}
					state={state.auto.highGoalAttempts}
					label="Balls Shot at High Goal (auto)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, highGoalShots: s },
						})
					}
					state={state.auto.highGoalShots}
					label="Balls Landed in High Goal (auto)"
				/>
			</div>
			<h1>Teleop</h1>
			<div className="inner">
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, cellsAcquired: s },
						})
					}
					state={state.teleop.cellsAcquired}
					label="Cells Picked Up (teleop)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, lowGoalAttempts: s },
						})
					}
					state={state.teleop.lowGoalAttempts}
					label="Balls Shot at Low Goal (teleop)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, lowGoalShots: s },
						})
					}
					state={state.teleop.lowGoalShots}
					label="Balls Landed in Low Goal (teleop)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, highGoalAttempts: s },
						})
					}
					state={state.teleop.highGoalAttempts}
					label="Balls Shot at High Goal (teleop)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, highGoalShots: s },
						})
					}
					state={state.teleop.highGoalShots}
					label="Balls Landed in High Goal (teleop)"
				/>
			</div>
			<h1>Climb</h1>
			<div className="inner">
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
				<Choice
					setState={(s) =>
						setState({
							...state,
							shooterPositions: (s ?? 0) as ShooterPositions,
						})
					}
					state={state.shooterPositions}
					options={["N/A", "At Hub", "Out of Tarmac", "Both"]}
					label="Shooter Range"
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
