import mongoose, { Schema } from 'mongoose';
import { EloInterface, EloModel, eloSchema } from './Elo.model';

/**
 * Define highscore schema, highscore model and highscore interface
 */
const highscoreSchema = new Schema({
    user: String,
	pin: String,
    elo: eloSchema,
});

export interface HighscoreInterface {
	user: string,
	pin: string,
	elo: EloInterface
}

export const HighscoreModel = mongoose.model('Highscore', highscoreSchema);