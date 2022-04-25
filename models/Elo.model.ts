import mongoose, { Schema } from 'mongoose';


/**
 * Defines eloSchema
 */

export const eloSchema = new Schema({
	points: Number,
	rank: Number
});

export interface EloInterface {
	points: number,
	rank: number
}

export const EloModel = mongoose.model('Elo', eloSchema);