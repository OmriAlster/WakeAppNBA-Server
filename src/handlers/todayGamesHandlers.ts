import axios, { AxiosResponse } from 'axios';
import { NBALiveData, NBAScoreboard } from '../dtos/nbaLiveApiDtos';
import { NBALiveGametoGameDto } from '../dtos/dtoUtils';
import Game, { GameStatus, IGame } from '../models/game';
import { updateAllRemainingGames } from './bdlGamesHandlers';
import { notifyAllGameHasStarted } from '../routes/events/gameStartedEvent';
import { gameStatusChanged } from '../routes/events/alarmEvent';

let currDate: string | undefined = undefined;

export const fetchTodayScoreboard = async () => {
	try {
		const today: AxiosResponse<NBALiveData> = await axios.get(
			'https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json',
		);
		const todayDate = today.data.scoreboard.gameDate;
		if (todayDate !== currDate) {
			currDate = todayDate;
			// todo : sse to front
			await updateAllRemainingGames();
		}
		await setLiveData(today.data.scoreboard);
	} catch (ex) {
		console.error('error in fetch live Data');
	}
};

const setLiveData = async (scoreboard: NBAScoreboard) => {
	for (const liveGame of scoreboard.games) {
		let currGame = await Game.findOne({ liveId: liveGame.gameId });
		if (currGame === null) {
			currGame = await Game.findOne({
				'homeTeam.teamName': liveGame.homeTeam.teamTricode,
				'awayTeam.teamName': liveGame.awayTeam.teamTricode,
				'gameTime.gameDate': scoreboard.gameDate,
			});
		}
		if (currGame !== null) {
			if (currGame.gameTime.gameStatusText !== liveGame.gameStatusText) {
				if (
					currGame.gameTime.gameStatus !== GameStatus.During &&
					liveGame.gameStatus === GameStatus.During
				) {
					notifyAllGameHasStarted(currGame.gameId);
				}

				console.log(
					`update ${liveGame.homeTeam.teamTricode} - ${liveGame.awayTeam.teamTricode} from ${currGame.gameTime.gameStatusText} to ${liveGame.gameStatusText}, ${liveGame.homeTeam.score} : ${liveGame.awayTeam.score}`,
				);
				const t = await Game.findByIdAndUpdate(
					currGame._id,
					NBALiveGametoGameDto(liveGame, scoreboard.gameDate),
					{ returnDocument: 'after' },
				);
				gameStatusChanged(currGame.gameId.toString(), t as IGame);
			}
		}
		// update db
		// sse that changed
		currGame = null;
	}
};
