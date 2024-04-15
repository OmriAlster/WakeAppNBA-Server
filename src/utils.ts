import axios, { AxiosResponse } from 'axios';
import Game from './models/game';
import { BDLGame } from './dtos/balldontlieDtos';
import { BDLGametoGameDto, NBALiveGametoGameDto } from './dtos/dtoUtils';
import { NBAGame, NBALiveData, NBAScoreboard } from './dtos/nbaLiveApiDtos';
import {
	closeConnectionForGame,
	sendGameUpdate,
	startSSEForGame,
} from './server-side-events';

let currDate: string | undefined = undefined;

export const runInterval = () => {
	setInterval(async () => {
		await fetchTodayScoreboard();
	}, 1000);
};

export const fetchTodayScoreboard = async () => {
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
		if (currGame?.gameTime.gameStatusText !== liveGame.gameStatusText) {
			console.log(
				`update ${liveGame.homeTeam.teamTricode} - ${liveGame.awayTeam.teamTricode} from ${currGame?.gameTime.gameStatusText} to ${liveGame.gameStatusText}, ${liveGame.homeTeam.score} : ${liveGame.awayTeam.score}`,
			);
			const t = await Game.findByIdAndUpdate(
				currGame?._id,
				NBALiveGametoGameDto(liveGame, scoreboard.gameDate),
			);

			currGame?.gameId && sendGameUpdate(currGame?.gameId.toString(), t);
		}
		// update db
		// sse that changed
		currGame = null;
	}
};

const updateAllRemainingGames = async () => {
	const games: BDLGame[] = await fetchAllRemainingGames();
	games.forEach(async (game) => {
		const existedGame = await Game.findOne({ gameId: game.id });
		if (!existedGame) {
			const createdGame = await Game.create(BDLGametoGameDto(game));
			console.log('bad!!');
		}
	});
};

const fetchAllRemainingGames = async () => {
	let hasNextPage = true;
	let nextCursor = null;
	let games: any[] = [];
	while (hasNextPage) {
		const response: AxiosResponse<{
			data: any;
			meta: { next_cursor: number };
		}> = await axios.get('http://api.balldontlie.io/v1/games', {
			headers: { Authorization: process.env.BALLDONTLIE_KEY },
			params: {
				seasons: [2023],
				per_page: 100,
				cursor: nextCursor,
				start_date: currDate,
			},
		});
		nextCursor = response.data.meta.next_cursor;
		games = games.concat(response.data.data);
		if (!response.data.meta.next_cursor) hasNextPage = false;
	}

	return games;
};
