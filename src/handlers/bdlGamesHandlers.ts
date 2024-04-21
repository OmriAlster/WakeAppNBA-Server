import axios, { AxiosResponse } from "axios";
import { BDLGame } from "../dtos/balldontlieDtos";
import { BDLGametoGameDto } from "../dtos/dtoUtils";
import  Game, { GameStatus } from "../models/game";


export const updateAllRemainingGames = async () => {
	const games: BDLGame[] = await fetchAllRemainingGames();
	games.forEach(async (game) => {
		const existedGame = await Game.findOne({ gameId: game.id });
		if (!existedGame) {
			await Game.create(BDLGametoGameDto(game));
			console.log('create game ' + game.id);
		} else if (
			(!existedGame.liveId &&
				new Date(existedGame.gameTime.gameDate) > new Date()) ||
			(existedGame.gameTime.gameStatus !== GameStatus.Final &&
				game.status === 'Final')
		) {
			const updatedGame = BDLGametoGameDto(game);
			if (
				existedGame.gameTime.gameStatus !== GameStatus.Final &&
				game.status === 'Final'
			) {
				updatedGame.gameTime.gameStatus = GameStatus.Final;
			}
			await Game.findByIdAndUpdate(existedGame._id, updatedGame);
			console.log('update game ' + game.id + ' : ' + game.date);
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
				// start_date: currDate,
			},
		});
		nextCursor = response.data.meta.next_cursor;
		games = games.concat(response.data.data);
		if (!response.data.meta.next_cursor) hasNextPage = false;
		
	}

	return games;
};
