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
	gameStatus: GameStatus;
	gameStatusText: string;
	period: number;
	gameClock?: string;
	gameTimeUTC: Date;
	gameDate: string;
}

interface Team {
	teamId: number;
	teamName: string;
	score: number;
}

export enum GameStatus {
	Before = 1,
	During = 2,
	Final = 3,
}

const TeamSchema: Schema<Team> = new Schema({
	teamId: { type: Number, required: true },
	teamName: { type: String, required: true },
	score: { type: Number, required: true },
});

// Define schema
const GameSchema: Schema<IGame> = new Schema({
	gameId: { type: Number, required: true, unique: true },
	liveId: { type: String },
	gameTime: {
		gameStatus: { type: Number, required: true },
		gameStatusText: { type: String, required: true },
		period: { type: Number, required: true },
		gameClock: { type: String },
		gameTimeUTC: { type: Date, required: true },
		gameDate: { type: String, required: true },
	},
	homeTeam: TeamSchema,
	awayTeam: TeamSchema,
});

// Export model
export default mongoose.model<IGame>('Game', GameSchema);
