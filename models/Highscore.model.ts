import mongoose, { Schema } from 'mongoose';

/**
 * Define highscore schema, highscore model and highscore interface
 */


const highscoreSchema = new Schema({
    user: String,
    highscore: Number,
});

export interface HighscoreInterface {
	user: string,
	highscore: number
}

export const HighscoreModel = mongoose.model('Highscore', highscoreSchema);