// controllers/userController.ts
import { Request, Response } from 'express';
import Game, { IGame } from '../models/game';
import axios, { AxiosResponse } from 'axios';
import { fetchTodayScoreboard } from '../utils';

class UserController {
	public async getAllUsers(req: Request, res: Response): Promise<void> {
		try {
			await fetchTodayScoreboard();
			res.sendStatus(200);
		} catch (error) {
			res.status(500).json({ message: error });
		}
	}

	public async getAllGames() {}
}

export default new UserController();
