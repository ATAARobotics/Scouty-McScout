export type MatchType = "qualification" | "practice";
// Make sure the information in this file lines up with the lib file in automated scout!
// Pit scouting data ranges
export type HumanPickupRange = 0 | 1 | 2 | 3;
export type StackType = 0 | 1 | 2 | 3;
export type ConfidenceLevel = 0 | 1 | 2 | 3 | 4;
export type BumperType = 0 | 1 | 2;
export type VisionType = 0 | 1 | 2 | 3;
export type PreferredStack = 0 | 1 | 2 | 3;
export type PreferredPlay = 0 | 1 | 2 | 3;
export type ChargeBattery = 0 | 1;

// Exporting match information
export interface MatchInfo {
	type: "match_info";
	match: number;
	matchCategory: MatchType;
	team: number;
	auto: {
		exitedTarmac: boolean;
		autoChargeStation: "off" | "on" | "charged" | "otherRobot";
		//conePickedUp: number;
		//cubePickedUp: number;
		hybridCubeScored: number;
		hybridConeScored: number;
		middleCubeScored: number;
		middleConeScored: number;
		highCubeScored: number;
		highConeScored: number;
	};
	teleop: {
		//conePickedUp: number;
		//cubePickedUp: number;
		hybridCubeScored: number;
		hybridConeScored: number;
		middleCubeScored: number;
		middleConeScored: number;
		highCubeScored: number;
		highConeScored: number;
		teleopChargeStation: "off" | "parked" | "on" | "charged";
	};
	speed: number;
	stability: number;
	defence: number | undefined;
	wasDisabled: boolean;
	notes: string;
	lastModifiedTime: number;
}

// Exporting robot information
export interface RobotInfo {
	type: "robot_info";
	scoutingTime: number;
	team: number;
	pit: {
		confidenceLevel: ConfidenceLevel | undefined;
		pitPeople: number | undefined;
		chaos: number | undefined;
		scoutingMethod: string;
	};
	robot: {
		bumperType: BumperType | undefined;
		visionType: VisionType | undefined;
		humanPickupRange: HumanPickupRange | undefined;
		stackType: StackType | undefined;
		preferredStack: PreferredStack | undefined;
		preferredPlay: PreferredPlay | undefined
		driveType: string;
		driveMotorAmount: number | undefined;
		otherMotorAmount: number | undefined;
		balanceTime: number | undefined;
		chargeBattery: ChargeBattery | undefined;
		batteryAmount: number | undefined;
		autoSettings: string;
		comments: string;
	};
	images: string[];
	lastModifiedTime: number;
}

/**
 * @param match
 * @param category
 * @param team
 */
function getIdFromMatchInfo(
	match: number,
	category: MatchType,
	team: number,
): string {
	return `@MatchInfo:match_${match.toString()}_${category.toString()}_${team.toString()}`;
}

/**
 * @param scoutingTime
 * @param team
 */
function getIdFromRobotInfo(scoutingTime: number, team: number): string {
	return `@RobotInfo:team_${team.toString()}_${scoutingTime.toString()}`;
}

/**
 * @param data
 */
export async function writeMatch(data: MatchInfo): Promise<boolean> {
	if (
		data.match === undefined ||
		data.matchCategory === undefined ||
		data.team === undefined
	) {
		return false;
	}
	const id = getIdFromMatchInfo(data.match, data.matchCategory, data.team);
	console.log("Writing Match Info:", id);
	try {
		localStorage.setItem(id, JSON.stringify(data));
	} catch (e) {
		alert(
			"Error saving (likely not enough storage space / too many images, try sync)",
		);
		console.error("Error saving:", e);
	}
	return true;
}

/**
 * @param data
 */
export async function writeRobot(
	data: RobotInfo,
	autoscoutUrl: string,
): Promise<boolean> {
	if (data.scoutingTime === undefined || data.team === undefined) {
		return false;
	}
	const id = getIdFromRobotInfo(data.scoutingTime, data.team);
	for (const id in data.images) {
		data.images[id] = data.images[id].replaceAll(
			"{AUTOSCOUT_URL}",
			autoscoutUrl,
		);
	}
	console.log("Writing Robot Info:", id);
	try {
		localStorage.setItem(id, JSON.stringify(data));
	} catch (e) {
		alert(
			"Error saving (likely not enough storage space / too many images, try sync)",
		);
		console.error("Error saving:", e);
	}
	return true;
}

/**
 * @param match
 * @param matchCategory
 * @param team
 */
export async function readMatch(
	match: number,
	matchCategory: MatchType,
	team: number,
): Promise<MatchInfo | undefined> {
	const id = getIdFromMatchInfo(match, matchCategory, team);
	const matchData = JSON.parse(localStorage.getItem(id) || "null");
	console.log("Loaded match ", id);
	if (matchData === null) {
		return undefined;
	}
	return matchData;
}

/**
 * @param scoutingTime
 * @param team
 */
export async function readRobot(
	scoutingTime: number,
	team: number,
): Promise<RobotInfo | undefined> {
	const id = getIdFromRobotInfo(scoutingTime, team);
	const matchData = JSON.parse(localStorage.getItem(id) || "null");
	console.log("Loaded team ", id);
	if (matchData === null) {
		return undefined;
	}
	return matchData;
}

/**
 * Clears all local data
 */

export async function clearData(): Promise<void> {
	localStorage.clear();
}
