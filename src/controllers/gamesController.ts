// controllers/userController.ts
import { Request, Response } from 'express';
import Game from '../models/game';

const getGamesBetweenDates = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { startDate, endDate } = req.query; // Assuming timeZone is passed as a query parameter
		let query: any = {};

		if (startDate) {
			query['gameTime.gameDate'] = { ...query['gameTime.gameDate'], $gte: startDate };
		  }
		  
		  if (endDate) {
			query['gameTime.gameDate'] = { ...query['gameTime.gameDate'], $lte: endDate };
		  }

		const games = await Game.find(query)
			.sort({ 'gameTime.gameTimeUTC': 1 })
			.exec();

		res.json(games);
	} catch (error) {
		console.error('Error fetching games:', error);
		res.status(500).json({ error: 'Failed to fetch games' });
	}
};

export default { getGamesBetweenDates };
