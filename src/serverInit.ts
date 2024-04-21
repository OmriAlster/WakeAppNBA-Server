import { Application } from 'express';
import { fetchTodayScoreboard } from './handlers/todayGamesHandlers';
import { gameAlarmEvent } from './routes/events/alarmEvent';
import { gameStartedEvent } from './routes/events/gameStartedEvent';

export const initServer = (app: Application) => {
	runInterval();
	gameAlarmEvent(app);
	gameStartedEvent(app);
};

const runInterval = () => {
	setInterval(async () => {
		await fetchTodayScoreboard();
	}, 1000);
};