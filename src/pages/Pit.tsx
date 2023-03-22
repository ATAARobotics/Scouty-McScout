import React from "react";
import NumberLine from "../components/NumberLine";
import TextBox from "../components/TextBox";
import Choice from "../components/Choice";
import Switch from "../components/Switch";
import NumberUpDown from "../components/NumberUpDown";
// This file is for pit scouting.
// Imports from database file
import {
	RobotInfo,
	HumanPickupRange,
	StackType,
	StackRange,
	ConfidenceLevel,
	writeRobot,
	readRobot,
} from "../util/database";

// Add an instruction to ask another team here
const perTeamInstructions: { [team: number]: string[] } = {
	[4421]: [
		"Scouting ourselves, be friendly!"
	],
};
/*To change:
Remove:
Doing Stuff  V
Friendly  V
Pickup Type V
Floor pickup range V
Everybot V

Change:
Drive train - make it a string V

Add:
Certainty meter V
Reversable Bumpers
Battery Quantity
No. of drivers
Are bumpers secure
Can they charge their batteries

(V means add to Automated Scout)
*/
// Decide the default state for the buttons
const defaultState: RobotInfo = {
	type: "robot_info",
	scoutingTime: 0,
	team: 0,
	pit: {
		confidence: undefined,
		pitPeople: undefined,
		chaos: undefined,
		comments: "",
	},
	robot: {
		humanPickupRange: undefined,
		stackType: undefined,
		stackRange: undefined,
		driveType: "Write any key drive train info here: ",
		balanceTime: undefined,
		comments: "",
	},
	images: [],
	lastModifiedTime: 0,
};

export default function Pit(): JSX.Element {
	const [scoutingTime, setScoutingTime] = React.useState<number>(0);
	const [teamNumber, setTeamNumber] = React.useState<number>(0);
	const [state, setStateRaw] = React.useState<RobotInfo>(defaultState);

	// If team hasnt been scouted, override
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
		setStateRaw(newState);
	};

	const [saved, setSaved] = React.useState<"saved" | "saving" | "error">(
		"saved",
	);
	React.useEffect(() => {
		setSaved("saving");
		console.log("Saving State: ", state);
		writeRobot(state, "").then((success) => {
			if (success) {
				setSaved("saved");
			} else {
				setSaved("error");
			}
		});
	}, [state]);

	// Taking images
	const saveImage = (
		image: HTMLImageElement | HTMLVideoElement,
		imageWidth: number,
		imageHeight: number,
	) => {
		const MAX_WIDTH = 960;
		const MAX_HEIGHT = 720;
		const scale = Math.min(MAX_WIDTH / imageWidth, MAX_HEIGHT / imageHeight);

		console.log("Saving image: ", imageWidth, imageHeight, image);

		const canvas = document.createElement("canvas");
		canvas.width = imageWidth * scale;
		canvas.height = imageHeight * scale;
		const context = canvas.getContext("2d");
		if (context !== null) {
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
			const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
			setState({
				...state,
				images: [...state.images, dataUrl],
			});
		}
	};
	// Taking videos
	const [videoStream, setVideoStream] = React.useState<MediaStream>();
	// Returns information on the website, anything put in here including comments will show on the site!
	// Has checkboxes inside, edit those depending on what we are scouting and what we want to ask
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
				<div className="item-container">
					<label htmlFor="visits">Visit # / Day</label>
					<select
						id="visits"
						onChange={(ev) => {
							const value = parseInt(ev.target.value) || 0;
							setScoutingTime(value);
						}}
						value={scoutingTime}
					>
						<option value="0">First Visit (Wednesday)</option>
						<option value="1">Second Visit (Friday)</option>
						<option value="2">Other Visit (Unplanned)</option>
					</select>
				</div>
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
							What gamepieces can your robot pick up?
						</label>
					</li>
					<li>
						<input id="cb-3" type="checkbox" />
						<label htmlFor="cb-3">
							Can your robot pick up from the floor, and specifically the hybrid module?
						</label>
					</li>
					<li>
						<input id="cb-4" type="checkbox" />
						<label htmlFor="cb-4">
							Which driver station dispensers can your robot pick up from?
						</label>
					</li>
					<li>
						<input id="cb-5" type="checkbox" />
						<label htmlFor="cb-5">
							What game pieces can you score?
						</label>
					</li>
					<li>
						<input id="cb-6" type="checkbox" />
						<label htmlFor="cb-6">
							What levels can you stack on?
						</label>
					</li>
					<li>
						<input id="cb-7" type="checkbox" />
						<label htmlFor="cb-7">
							How long does it take for you to balance?
						</label>
					</li>
					<li>
						<input id="cb-8" type="checkbox" />
						<label htmlFor="cb-8">
							Whats your drive train?
						</label>
					</li>
					{(perTeamInstructions[teamNumber] ?? []).map(
						(name: string, i: number) => (
							<li key={name}>
								<input id={`cb-9-${i}`} type="checkbox" />
								<label htmlFor={`cb-9-${i}`}>{name}</label>
							</li>
						),
					)}
					<li>
						<input id="cb-10" type="checkbox" />
						<label htmlFor="cb-10">
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
							pit: { ...state.pit, confidence: s as ConfidenceLevel },
						})
					}
					state={state.pit.confidence}
					options={["Honest about issues", "Unsure on alot", "Generally Anxious", "Uncertain on a few things", "Confident"]}
					label="Confidence in Answers"
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
			</div>
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
			<h1>Bot</h1>
			<div className="inner">
				<Choice
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, humanPickupRange: s as HumanPickupRange },
						})
					}
					state={state.robot.humanPickupRange}
					options={["None", "Chute", "Slide Shelf", "Both"]}
					label="Human Player Pickup Range"
				/>
			<Choice
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, stackType: s as StackType },
						})
					}
					state={state.robot.stackType}
					options={["None", "Cones Only", "Cubes Only", "Both"]}
					label="Stacking Type"
				/>
				<Choice
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, stackRange: s as StackRange },
						})
					}
					state={state.robot.stackRange}
					options={["None", "Hybrid Only", "Middle", "High", "All"]}
					label="Stacking Range"
				/>
				<NumberUpDown
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, balanceTime: s },
						})
					}
					state={state.robot.balanceTime}
					label="Balance Time (seconds)"
				/>
				<TextBox
					setState={(s) =>
						setState({
							...state,
							robot: { ...state.robot, driveType: s },
						})
					}
					state={state.robot.driveType}
					label="Drive Train"
				/>
			</div>
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
			<h1>Pictures</h1>
			<div className="inner">
				<div className="item-container">
					<label htmlFor="cap-image">Capture Robot Picture</label>
					<input
						id="cap-image"
						type="file"
						capture="environment"
						accept="image/*"
						onChange={(ev) => {
							if (ev.target.files !== null) {
								const fileList = ev.target.files;
								for (let i = 0; i < fileList.length; i++) {
									const file = fileList[i];
									if (file !== undefined) {
										const img = document.createElement("img");
										img.addEventListener("load", () => {
											saveImage(img, img.width, img.height);
										});
										img.src = URL.createObjectURL(file);
									}
								}
							}
						}}
					/>
				</div>
				{(() => {
					if (videoStream !== undefined) {
						return (
							<video
								autoPlay
								ref={(tag) => {
									if (tag !== null) {
										tag.srcObject = videoStream;
										tag.play();
									}
								}}
								onClick={(ev) =>
									saveImage(
										ev.target as HTMLVideoElement,
										(ev.target as HTMLVideoElement).videoWidth,
										(ev.target as HTMLVideoElement).videoHeight,
									)
								}
							/>
						);
					} else {
						return (
							<button
								onClick={() => {
									navigator.mediaDevices
										.getUserMedia({
											video: {
												width: {
													min: 480.0,
													max: 1920.0,
													ideal: 960.0,
												},
												height: {
													min: 360.0,
													max: 1080.0,
													ideal: 720.0,
												},
												facingMode: "environment",
											},
										})
										.then(setVideoStream);
								}}
							>
								Start Video
							</button>
						);
					}
				})()}
			</div>
			<div className="inner">
				{state.images.map((img, i) => (
					<div className="item-container" key={`image-${i}`}>
						<button
							onClick={() => {
								setState({
									...state,
									images: state.images.filter((_, i2) => i2 !== i),
								});
							}}
						>
							X
						</button>
						<img className="bot-image" src={img} />
					</div>
				))}
			</div>
		</div>
	);
}
