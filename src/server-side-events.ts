// server-sent-events.ts
import { Application, Request, Response } from 'express';

const gameConnections = new Map<string, Response[]>();

export function startSSEForGame(app: Application) {
	// Define a map to store connections for each game ID
	// SSE endpoint for the game
	app.get('/api/game/:id', (req: Request, res: Response) => {
		console.log('hi I want to connect');
		const { id } = req.params;

		// Set headers for SSE
		res
			.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			})
			.write('connected for game ' + id);

		// Add the response object to the map for the specific game ID
		if (!gameConnections.has(id)) {
			gameConnections.set(id, []);
		}
		gameConnections.get(id)?.push(res);
		console.log('connected devices : ' + gameConnections);

		// Handle client disconnects
		req.on('close', () => {
			console.log('I want to close');
			const connections = gameConnections.get(id);
			if (connections) {
				const index = connections.indexOf(res);
				if (index !== -1) {
					connections.splice(index, 1);
				}
			}
			console.log(`Client disconnected from SSE for game ${id}`);
		});
	});

	// Function to send SSE events to clients for a specific game

	// Example usage:
	// Call sendGameUpdate function whenever there is a game update
	// sendGameUpdate('gameId', { message: 'Game updated' });
}

export function sendGameUpdate(gameId: string, data: any) {
	const eventData = JSON.stringify(data);

	// Get the array of response objects for the specific game ID from the map
	const connections = gameConnections.get(gameId);
	if (connections) {
		// Send SSE event to each client
		connections.forEach((res) => {
			res.write(`data: ${eventData}\n\n`);
		});
	}
}

export const closeConnectionForGame = (gameId: string) => {
	console.log('wants to close for ' + gameId);
	const connections = gameConnections.get(gameId);
	if (connections) {
		connections.forEach((res) => {
			// End the response to close the connection
			res.end();
		});
		// Clear connections for the game ID
		gameConnections.delete(gameId);
		console.log(`Connections closed for game ${gameId}`);
	}
};
