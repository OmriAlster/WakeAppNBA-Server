// server-sent-events.ts
import { Application, Request, Response } from 'express';
import { IGame } from './models/game';

type AlarmResponse = {
	res : Response,
	alarmInfo : GameEventRequestBody
}

const gameConnections = new Map<string, AlarmResponse[]>();

type GameEventRequestBody = {
	time : number,
	diff : number
}

export function startSSEForGame(app: Application) {
	// Define a map to store connections for each game ID
	// SSE endpoint for the game
	app.get('/api/game/:id/:time/:diff', (req: Request<any, any, GameEventRequestBody>, res: Response) => {
		console.log('hi I want to connect : ');
		const { id, time, diff } = req.params;
		// Set headers for SSE
		res
			.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			})
			.write(`data: connected for game ${id}\n\n`);

		// Add the response object to the map for the specific game ID
		if (!gameConnections.has(id)) {
			gameConnections.set(id, []);
		}
		const alarmRes : AlarmResponse = {res : res, alarmInfo :{time : time, diff : diff}}

		gameConnections.get(id)?.push(alarmRes);
		console.log('connected devices : ' + gameConnections.get(id)?.length);

		// Handle client disconnects
		req.on('close', () => {
			console.log('I want to close');
			closeRequest(alarmRes, id);
		});
	});

	// Function to send SSE events to clients for a specific game

	// Example usage:
	// Call sendGameUpdate function whenever there is a game update
	// sendGameUpdate('gameId', { message: 'Game updated' });
}

const closeRequest = (alarmRes : AlarmResponse, gameId : string) => {
	const connections = gameConnections.get(gameId);
	if (connections) {
		const index = connections.indexOf(alarmRes);
		if (index !== -1) {
			connections[index].res.end();
			connections.splice(index, 1);
		}
	}
	console.log(`Client disconnected from SSE for game ${gameId}`);
}

export function sendGameUpdate(gameId: string, data: IGame) {
	// Get the array of response objects for the specific game ID from the map
	const connections = gameConnections.get(gameId);
	if (connections) {
		// Send SSE event to each client
		connections.forEach((alarmRes) => {
			const liveGame = liveTimeAndDiff(data)
			if (liveGame.time > alarmRes.alarmInfo.time) {
				if (liveGame.diff < alarmRes.alarmInfo.diff){
				const eventData = `Wake Up!! ${data.homeTeam.teamName} ${data.homeTeam.score} : ${data.awayTeam.score} ${data.awayTeam.teamName}, ${data.gameTime.gameStatusText}`
				alarmRes.res.write(`data: ${eventData}\n\n`);
				}
				closeRequest(alarmRes, gameId)
			}
		});
	}
}

export const closeConnectionForGame = (gameId: string) => {
	console.log('wants to close for ' + gameId);
	const connections = gameConnections.get(gameId);
	if (connections) {
		connections.forEach((alarmRes) => {
			// End the response to close the connection
			alarmRes.res.end();
		});
		// Clear connections for the game ID
		gameConnections.delete(gameId);
		console.log(`Connections closed for game ${gameId}`);
	}
};

const liveTimeAndDiff = (liveGame : IGame) : GameEventRequestBody => {
		const liveTime = ((liveGame.gameTime.period ?? 0) * 12) - gameClockToMinutes(liveGame.gameTime.gameClock ?? 'PT0M00.00S');
		const liveDiff = Math.abs(liveGame.homeTeam.score - liveGame.awayTeam.score)
		return { time : liveTime, diff : liveDiff}
}

const gameClockToMinutes = (gameClock : string) => {
	const regex = /PT(\d+)M([\d.]+)S/;
	const match = gameClock.match(regex);
  
	if (!match) {
	  throw new Error('Invalid duration string');
	}
  
	const minutes = parseInt(match[1]);
	const seconds = parseFloat(match[2]);
  
	return minutes + seconds / 60;
  }
