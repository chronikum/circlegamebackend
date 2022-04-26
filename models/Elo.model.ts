import mongoose, { Schema } from 'mongoose';


/**
 * Defines eloSchema
 */

export const eloSchema = new Schema({
	points: Number,
	rank: Number,
	trend: Number
});

export interface EloInterface {
	points: number,
	rank: number,
	trend: number
}

export const EloModel = mongoose.model('Elo', eloSchema);