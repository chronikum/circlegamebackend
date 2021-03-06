import mongoose, { Schema } from 'mongoose';
import { AnySchema, number, object, string } from 'yup';
import { EloInterface, EloModel, eloSchema } from './Elo.model';
import { Request, Response, NextFunction } from 'express';


/**
 * Define highscore schema, highscore model and highscore interface
 */
const historySchema = new Schema({
    username: String,
    games: [eloSchema],
});

export interface HistoryInterface {
	username: string,
	games: EloInterface[]
}

export const HistoryModel = mongoose.model('History', historySchema);