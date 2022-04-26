import mongoose, { Schema } from 'mongoose';
import { AnySchema, number, object, string } from 'yup';
import { EloInterface, EloModel, eloSchema } from './Elo.model';
import { Request, Response, NextFunction } from 'express';


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
 * This is the yup validation schema for user values
 */
export const userValidationSchema = object({
	user: object({
		username: string().min(2).required(),
		pass: string().min(2).required(),
		elo: object().shape({
			points: number().integer().positive().required(),
			rank: number().integer().positive().required(),
		})
	}),
});

/**
 * Validates a schema described at the body of the request
 * @param schema to validate
 * @returns 
 */
export const validateSchema = (schema: AnySchema) => async function (req: Request, res: Response, next: NextFunction) {
	try {
		await userValidationSchema.validate(req.body);
		return next();
	} catch (error) {
		console.log(error)
		return res.status(400).send({ success: false, message: "Invalid data format! Please check if all fields are filled properly. Also, tampering with the API makes Marvin sad :(" });
	}
};