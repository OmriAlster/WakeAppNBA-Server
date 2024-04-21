// server.ts
import express, { Application } from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/gamesRoutes';
import * as dotenv from 'dotenv';
import { initServer } from './serverInit';
import cors from 'cors';
import moment from 'moment';

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
app.use(cors());
app.use('/api/games', userRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
initServer(app);
