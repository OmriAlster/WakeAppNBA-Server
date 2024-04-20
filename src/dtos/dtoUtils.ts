import { IGame } from '../models/game';
import { BDLGame } from './balldontlieDtos';
import { NBAGame } from './nbaLiveApiDtos';

export const BDLGametoGameDto = (bdlGame: BDLGame): IGame => {
	return {
		gameId: bdlGame.id,
		gameTime: {
			gameDate: bdlGame.date,
			gameStatusText: createStatusText(bdlGame.status),
			gameTimeUTC:
				new Date(bdlGame.status).toString() === 'Invalid Date'
					? new Date(bdlGame.date)
					: new Date(bdlGame.status),
			gameClock: bdlGame.time,
			period: bdlGame.period,
		},
		homeTeam: {
			teamId: BDLtoNBALiveTeamId[bdlGame.home_team.id],
			teamName: bdlGame.home_team.abbreviation,
			score : bdlGame.home_team_score
		},
		awayTeam: {
			teamId: BDLtoNBALiveTeamId[bdlGame.visitor_team.id],
			teamName: bdlGame.visitor_team.abbreviation,
			score : bdlGame.visitor_team_score
		},
	} as IGame;
};
export const NBALiveGametoGameDto = (
	liveGame: NBAGame,
	gameDate: string,
): IGame => {
	return {
		liveId: liveGame.gameId,
		gameTime: {
			gameStatus: liveGame.gameStatus,
			gameStatusText: liveGame.gameStatusText,
			gameTimeUTC: new Date(liveGame.gameTimeUTC),
			gameClock: liveGame.gameClock,
			period: liveGame.period,
			gameDate: gameDate,
		},
		homeTeam: {
			teamId: liveGame.homeTeam.teamId,
			teamName: liveGame.homeTeam.teamTricode,
			score: liveGame.homeTeam.score,
		},
		awayTeam: {
			teamId: liveGame.awayTeam.teamId,
			teamName: liveGame.awayTeam.teamTricode,
			score: liveGame.awayTeam.score,
		},
	} as IGame;
};

const createStatusText = (dateString: string) => {
	const gameDate = new Date(dateString);
	return gameDate.toString() !== 'Invalid Date' ? gameDate.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23', // Use 24-hour format
	}) : dateString;
};

const BDLtoNBALiveTeamId : Record<number,number> = {
	1 : 1610612737,
	2 : 1610612738,
	3: 1610612751,
	4: 1610612766,
	5: 1610612741,
	6: 1610612742,
	7: 1610612739,
	8: 1610612743,
	9: 1610612765,
	10: 1610612744,
	11: 1610612745,
	12: 1610612754,
	13: 1610612746,
	14: 1610612747,
	15: 1610612763,
	16: 1610612748,
	17: 1610612749,
	18: 1610612750,
	19: 1610612740,
	20: 1610612752,
	21: 1610612760,
	22: 1610612753,
	23: 1610612755,
	24: 1610612756,
	25: 1610612757,
	26: 1610612758,
	27: 1610612759,
	28: 1610612761,
	29: 1610612762,
	30: 1610612764
}
