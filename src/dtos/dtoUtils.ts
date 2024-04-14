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
					? undefined
					: new Date(bdlGame.status),
			gameClock: bdlGame.time,
			period: bdlGame.period,
		},
		homeTeam: {
			teamId: bdlGame.home_team.id,
			teamName: bdlGame.home_team.abbreviation,
		},
		awayTeam: {
			teamId: bdlGame.visitor_team.id,
			teamName: bdlGame.visitor_team.abbreviation,
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
	return new Date(dateString).toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23', // Use 24-hour format
	});
};
