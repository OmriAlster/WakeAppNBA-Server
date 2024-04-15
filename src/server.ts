// server.ts
import express, { Application } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import * as dotenv from 'dotenv';
import { runInterval } from './utils';
import { startSSEForGame } from './server-side-events';

const app: Application = express();

dotenv.config();

const { MONGO_URI, PORT } = process.env;

app.use(express.json());

mongoose.connect(MONGO_URI ?? '');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
	console.log('Connected to MongoDB');
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

runInterval();
startSSEForGame(app);
