// controllers/userController.ts
import { Request, Response } from 'express';
import Game, { IGame } from '../models/game';
import axios, { AxiosResponse } from 'axios';
import { fetchTodayScoreboard } from '../utils';
import moment from 'moment-timezone';

const getGamesBetweenDates = async (req: Request, res: Response): Promise<void> => {
	try {
		const { startDate, endDate, timeZone } = req.query; // Assuming timeZone is passed as a query parameter
		if (!startDate || !endDate || !timeZone) {
			res.status(400).json({ error: 'startDate, endDate, and timeZone are required' });
			return;
		}

		// Convert user's local time to UTC for querying the database
		const startUtc = moment.tz(startDate, timeZone as string).utc().toDate();
		const endUtc = moment.tz(endDate, timeZone as string).endOf('day').utc().toDate();
		console.log(startUtc, endUtc)
		const games: IGame[] = await Game.find({
			'gameTime.gameTimeUTC': { $gte: startUtc, $lte: endUtc }
		});
		// Convert game times to user's local time zone for response
		const gamesByDate: { [key: string]: IGame[] } = {};
		games.forEach((game: IGame) => {
			const gameDate = moment(game.gameTime.gameTimeUTC).tz(timeZone as string).format('YYYY-MM-DD');
			if (!gamesByDate[gameDate]) {
				gamesByDate[gameDate] = [];
			}
			gamesByDate[gameDate].push(game);
		});

		res.json(gamesByDate);
	} catch (error) {
		console.error('Error fetching games:', error);
		res.status(500).json({ error: 'Failed to fetch games' });
	}
};

export default {getGamesBetweenDates};