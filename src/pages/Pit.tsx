import React from "react";
import NumberLine from "../components/NumberLine";
import TextBox from "../components/TextBox";
import Choice from "../components/Choice";
import Switch from "../components/Switch";
import NumberUpDown from "../components/NumberUpDown";

import {
	RobotInfo,
	ClimbLevel,
	ShooterPositions,
	BusinessLevel,
	BallCapacity,
	ShooterCapability,
	DriveType,
	writeRobot,
	readRobot,
} from "../util/database";

const perTeamInstructions: { [team: number]: string[] } = {
	[4421]: [
		"This is a specific instruction for our team",
		"This is another one",
		"Don't scout ourselves!",
	],
};

const defaultState: RobotInfo = {
	type: "robot_info",
	scoutingTime: 0,
	team: 0,
	pit: {
		busy: undefined,
		pitPeople: undefined,
		chaos: undefined,
		friendly: undefined,
		comments: "",
	},
	robot: {
		autoBallCount: undefined,
		ballCapacity: undefined,
		climbTime: undefined,
		climbHeight: undefined,
		climbEverybot: undefined,
		shooterCapability: undefined,
		shooterRange: undefined,
		driveType: undefined,
		comments: "",
	},
	lastModifiedTime: 0,
};

export default function Pit(): JSX.Element {
	const [scoutingTime, setScoutingTime] = React.useState<number>(0);
	const [teamNumber, setTeamNumber] = React.useState<number>(0);
	const [state, setStateRaw] = React.useState<RobotInfo>(defaultState);

	React.useEffect(() => {
		if (scoutingTime !== undefined && teamNumber !== undefined) {
			readRobot(scoutingTime, teamNumber).then((match) => {
				if (match !== undefined) {
					setStateRaw(match);
				} else {
					setStateRaw({
						...defaultState,
						scoutingTime: scoutingTime,
						team: teamNumber,
					});
				}
			});
		}
	}, [scoutingTime, teamNumber]);
	const setState = (newState: RobotInfo) => {
		newState.lastModifiedTime = Date.now();
		console.log("State: ", newState);
		setStateRaw(newState);
	};

	const [saved, setSaved] = React.useState<"saved" | "saving" | "error">(
		"saved",
	);
	React.useEffect(() => {
		setSaved("saving");
		writeRobot(state).then((success) => {
			if (success) {
				setSaved("saved");
			} else {
				setSaved("error");
			}
		});
	}, [state]);

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
				<NumberLine
					setState={(value) => setTeamNumber(value ?? 0)}
					state={teamNumber}
					label="Team Number"
				/>
				<NumberUpDown
					setState={(value) => setScoutingTime(value ?? 0)}
					state={scoutingTime}
					label="# Times Scouting This Team"
				/>
			</div>
			<h1>Checklist</h1>
			<div className="inner">
				<ol>
					<li>
						<input id="cb-1" type="checkbox" />
						<label htmlFor="cb-1">
							Do you have time to answer a few quick questions?
						</label>
					</li>
					<li>
						<input id="cb-2" type="checkbox" />
						<label htmlFor="cb-2">
							Can you shoot high goal if so where can you shoot from?
						</label>
					</li>
					<li>
						<input id="cb-3" type="checkbox" />
						<label htmlFor="cb-3">
							How high can you climb and how long do you need to climb?
						</label>
					</li>
					<li>
						<input id="cb-4" type="checkbox" />
						<label htmlFor="cb-4">
							How many balls can you score in auto?
						</label>
					</li>
					{(perTeamInstructions[teamNumber] ?? []).map(
						(name: string, i: number) => (
							<li key={name}>
								<input id={`cb-5-${i}`} type="checkbox" />
								<label htmlFor={`cb-5-${i}`}>{name}</label>
							</li>
						),
					)}
					<li>
						<input id="cb-6" type="checkbox" />
						<label htmlFor="cb-6">
							Can we take pictures of your robot?
						</label>
					</li>
				</ol>
			</div>
			<h1>Pit</h1>
			<div className="inner">
				<Choice
					setState={(s) =>
						setState({
							...state,
							pit: { ...state.pit, busy: s as BusinessLevel },
						})
					}
					state={state.pit.busy}
					options={["No", "General", "Repairs"]}
					label="Doing Stuff"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							pit: { ...state.pit, pitPeople: s },
						})
					}
					state={state.pit.pitPeople}
					label="Number of People in Pit"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							pit: { ...state.pit, chaos: s },
						})
					}
					state={state.pit.chaos}
					options={[
						"Calm, Cool & Collected",
						"Fairly Calm",
						"Average",
						"Slightly Frantic",
						"Pure Chaos",
					]}
					label="Chaos Level"
				/>
				<Switch
					setState={(s) =>
						setState({
							...state,
							pit: { ...state.pit, friendly: s },
						})
					}
					state={state.pit.friendly}
					label="Friendly"
				/>
				<TextBox
					setState={(s) =>
						setState({
							...state,
							pit: { ...state.pit, comments: s },
						})
					}
					state={state.pit.comments}
					label="Pit/Team Notes and Comments"
				/>
			</div>
			<h1>Bot</h1>
			<div className="inner">
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, autoBallCount: s },
						})
					}
					state={state.robot.autoBallCount}
					label="Auto Ball Count"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, ballCapacity: s as BallCapacity },
						})
					}
					state={state.robot.ballCapacity}
					options={["No Shooter", "1", "2"]}
					label="Ball Capacity"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, climbTime: s },
						})
					}
					state={state.robot.climbTime}
					label="Climb Time (seconds)"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, climbHeight: s as ClimbLevel },
						})
					}
					state={state.robot.climbHeight}
					options={["None", "Low", "Medium", "High", "Traversal"]}
					label="Climb Height"
				/>
				<Switch
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, climbEverybot: s },
						})
					}
					state={state.robot.climbEverybot}
					label="Everybot Hooks"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							robot: {
								...state.robot,
								shooterCapability: s as ShooterCapability,
							},
						})
					}
					state={state.robot.shooterCapability}
					options={["None", "Low", "High", "Both"]}
					label="Shooter"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							robot: {
								...state.robot,
								shooterRange: s as ShooterPositions,
							},
						})
					}
					state={state.robot.shooterRange}
					options={["N/A", "At Hub", "Out of Tarmac", "Both"]}
					label="Shooter Range"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, driveType: s as DriveType },
						})
					}
					state={state.robot.driveType}
					options={["Swerve", "Tank", "Other"]}
					label="Drive Train"
				/>
				<TextBox
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, comments: s },
						})
					}
					state={state.robot.comments}
					label="Bot Notes and Comments"
				/>
			</div>
		</div>
	);
}
