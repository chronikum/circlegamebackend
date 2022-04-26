import mongoose, { Schema } from 'mongoose';
import { EloInterface, EloModel, eloSchema } from './Elo.model';

/**
 * Define highscore schema, highscore model and highscore interface
 */
const userSchema = new Schema({
    username: String,
	pass: String,
    elo: eloSchema,
});

export interface UserInterface {
	username: string,
	pass: string,
	elo: EloInterface
}

export const UserModel = mongoose.model('User', userSchema);

/**
 * Public user interface
 */
export type PublicUser = Omit<UserInterface, "pass">;