import { Application, Request, Response } from 'express';

const liveConnections : Response[] = [];

export const startSSEForGameStarted = (app: Application) => {
    app.get('/api/startedGames', (req: Request, res: Response) => {
		console.log('hi I want to listen for starting games : ');
		// Set headers for SSE
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        })
        .write(`data: start listening to games\n\n`);

        liveConnections.push(res)
        console.log(`${liveConnections.length} listen to live games`)

        req.on('close', () => {
			console.log('I want to close');
			const index = liveConnections.indexOf(res);
            if (index !== -1) {
                liveConnections[index].end();
                liveConnections.splice(index, 1);
            }
		});
    });
}

export const notifyGameHasStarted = (gameId : number) => {
    liveConnections.forEach(res => 
        res.write(`data: game ${gameId} has started\n\n`)
    )
}