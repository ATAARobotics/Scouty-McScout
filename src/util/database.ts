import AsyncStorage from "@react-native-async-storage/async-storage";

export type MatchType = "qualification" | "practice";

export type ClimbLevel = 0 | 1 | 2 | 3 | 4;

export interface MatchInfo {
	type: "match_info";
	match: number;
	matchCategory: MatchType;
	team: number;
	auto: {
		exitedTarmac: boolean;
		startingLocation: "left" | "middle" | "right";
		cellsAcquired: number;
		lowGoalAttempts: number;
		lowGoalShots: number;
		highGoalAttempts: number;
		highGoalShots: number;
	};
	teleop: {
		cellsAcquired: number;
		lowGoalAttempts: number;
		lowGoalShots: number;
		highGoalAttempts: number;
		highGoalShots: number;
	};
	climb: {
		startedBeforeEndgame: boolean;
		highestAttempted: ClimbLevel;
		highestScored: ClimbLevel;
		fell: boolean;
	};
	speed: number;
	stability: number;
	defence: number | undefined;
	isPrimaryDefence: boolean;
	wasBroken: boolean;
	wasDisabled: boolean;
	notes: string;
	lastModifiedTime: number;
}

export type Size = 0 | 1 | 2;

export interface RobotInfo {
	type?: "robot_info";
	team?: number;
	size?: Size;
	appearance?: number;
	pitCrewSkill?: number;
	robotDone?: boolean;
	broken?: boolean;
	notes?: string;
	// TODO
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
	await AsyncStorage.setItem(id, JSON.stringify(data));
	return true;
}

// /**
//  * @param data
//  */
// export async function writeRobot(data: RobotInfo): Promise<void> {
// 	// db.put({
// 	// 	_id: [data.team],
// 	// 	...data
// 	// });
// }

/**
 * @param match
 * @param match_category
 * @param team
 */
export async function readMatch(
	match: number,
	matchCategory: MatchType,
	team: number,
): Promise<MatchInfo | undefined> {
	const matchData = JSON.parse(
		(await AsyncStorage.getItem(
			getIdFromMatchInfo(match, matchCategory, team),
		)) || "null",
	);
	if (matchData === null) {
		return undefined;
	}
	return matchData;
}

// /**
//  * @param team
//  */
// export async function readRobot(team: number): Promise<RobotInfo> {
// 	return undefined as any as RobotInfo;
// 	// return db.get(["match_info", team]);
// }

/**
 * Clears all local data
 */

export async function clearData(): Promise<void> {
	await AsyncStorage.clear();
}
