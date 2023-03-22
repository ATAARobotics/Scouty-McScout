import React from "react";
import NumberLine from "../components/NumberLine";
import TextBox from "../components/TextBox";
import Choice from "../components/Choice";
import Switch from "../components/Switch";
import NumberUpDown from "../components/NumberUpDown";
// This is for match data
import {
	MatchInfo,
	MatchType,
	readMatch,
	writeMatch,
} from "../util/database";

/*
Things to add:
Someone on team balanced (get from blue alliance?)
 */
// Decide the default state of the buttons
const defaultState: MatchInfo = {
	type: "match_info",
	match: 0,
	matchCategory: "qualification",
	team: 0,
	auto: {
		exitedTarmac: false,
		autoChargeStation: "otherRobot",
		//conePickedUp: 0,
		//cubePickedUp: 0,
		hybridCubeScored: 0,
		hybridConeScored: 0,
		middleCubeScored: 0,
		middleConeScored: 0,
		highCubeScored: 0,
		highConeScored: 0,
	},
	teleop: {
		//conePickedUp: 0,
		//cubePickedUp: 0,
		hybridCubeScored: 0,
		hybridConeScored: 0,
		middleCubeScored: 0,
		middleConeScored: 0,
		highCubeScored: 0,
		highConeScored: 0,
		teleopChargeStation: "off",
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
// Require that match category, match number and team number are filled in to continue
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

	// This displays the information on the website, anything put in this constructor will show (including comments)
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
					label="Exited Tarmac (Coloured Tape)"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, hybridCubeScored: s },
						})
					}
					state={state.auto.hybridCubeScored}
					label="Cubes Scored in Low Goal (auto)"
					className="cube low"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							auto: { ...state.auto, hybridConeScored: s },
						})
					}
					state={state.auto.hybridConeScored}
					label="Cones Scored in Low Goal (auto)"
					className="cone low"
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
					className="cube mid"
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
					className="cone mid"
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
					className="cube high"
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
					className="cone high"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							auto: {
								...state.auto,
								autoChargeStation: ["otherRobot", "off", "on", "charged"][
									s ?? 0
								] as "off" | "on" | "charged" | "otherRobot",
							},
						})
					}
					state={
						state.auto.autoChargeStation === "otherRobot"
							? 0
							: state.auto.autoChargeStation === "off"
							? 1
							: state.auto.autoChargeStation === "on"
							? 2
							: state.auto.autoChargeStation === "charged"
							? 3
							: undefined
					}
					options={["Didn't Attempt", "Off", "On", "Charged"]}
					label="Auto Charge Station (Balance)"
				/> 	
			</div>
			<h1>Teleop</h1>
			<div className="inner">
			
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, hybridCubeScored: s },
						})
					}
					state={state.teleop.hybridCubeScored}
					label="Cube Scored in Low Goal (teleop)"
					className="cube low"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							teleop: { ...state.teleop, hybridConeScored: s },
						})
					}
					state={state.teleop.hybridConeScored}
					label="Cone Scored in Low Goal (teleop)"
					className="cone low"
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
					className="cube mid"
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
					className="cone mid"
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
					className="cube high"
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
					className="cone high"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							teleop: {
								...state.teleop,
								teleopChargeStation: ["off", "parked", "on", "charged"][
									s ?? 0
								] as "off" | "parked" | "on" | "charged",
							},
						})
					}
					state={
						state.teleop.teleopChargeStation === "off"
							? 0
							: state.teleop.teleopChargeStation === "parked"
							? 1
							: state.teleop.teleopChargeStation === "on"
							? 2
							: state.teleop.teleopChargeStation === "charged"
							? 3
							: undefined
					}
					options={["Off", "Parked", "On", "Charged"]}
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
