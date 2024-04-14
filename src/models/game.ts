import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces
export interface IGame extends Document {
	gameId: number;
	liveId?: string;
	gameTime: GameTime;
	homeTeam: Team;
	awayTeam: Team;
}

interface GameTime {
	gameStatus?: GameStatus;
	gameStatusText: string;
	period?: number;
	gameClock?: string;
	gameTimeUTC?: Date;
	gameDate: string;
}

interface Team {
	teamId: number;
	teamName: string;
	score?: number;
}

enum GameStatus {
	Before = 1,
	During = 2,
	Final = 3,
}

// Define schema
const GameSchema: Schema<IGame> = new Schema({
	gameId: { type: Number, required: true, unique: true },
	liveId: { type: String },
	gameTime: {
		gameStatus: { type: Number },
		gameStatusText: { type: String, required: true },
		period: { type: Number },
		gameClock: { type: String },
		gameTimeUTC: { type: Date },
		gameDate: { type: String, required: true },
	},
	homeTeam: {
		teamId: { type: Number, required: true },
		teamName: { type: String, required: true },
		score: { type: Number },
	},
	awayTeam: {
		teamId: { type: Number, required: true },
		teamName: { type: String, required: true },
		score: { type: Number },
	},
});

// Export model
export default mongoose.model<IGame>('Game', GameSchema);
