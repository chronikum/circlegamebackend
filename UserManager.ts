
import { hash } from "argon2";
import { EloInterface } from "./models/Elo.model";
import { UserInterface, UserModel } from "./models/Highscore.model";
import { HistoryModel } from "./models/History.model";

const argon2 = require('argon2');


/**
 * This function creates the user if the usert does not exist yet.
 * It returns true if something goes wrong
 */
export async function createUserIfNotExistent(user: UserInterface) {
	console.log("Searching for: " + JSON.stringify(user))
	const playerExists = await UserModel.findOne({ username: user.username })
	if (!playerExists) {
		console.log("User does not exist and should be created!")
		return await createNewUser(user);
	}
	return false
}

/**
 * Creates a new user in the databse
 * - only gets called when user is not existent yet
 * @param user to create
 */
export async function createNewUser(user: UserInterface) {
	try {
		const hashedValue = await argon2.hash(user.password);
		user.password = hashedValue;
		user.elo.points = 0;
		user.elo.rank = 0;
		user.elo.trend = 0;
		const createdUser = await UserModel.create(user);
		return true
	} catch (err) {
		return false;
	}
}


/**
 * Validates a users password
 * @param user to check
 * @param password to check with
 * 
 * Returns true and false based on if the password is correct or not
 */
export async function checkPasswordOfUser(user: string, password: string) {
	const playerExists = await UserModel.findOne({ username: user })

	if (!playerExists) {
		return true
	}
	try {
		if (await argon2.verify(playerExists.password, password)) {
			console.log("Password is correct!")
			return true
		} else {
			console.log("Password is incorrect!")
			return false
		}
	} catch (err) {
		console.log("Argon2 error: " + err)
		return false
	}
}

/**
 * Add game to the user history
 */
export async function addGameToUserHistory(user: UserInterface, game: EloInterface) {
	await HistoryModel.updateOne(
		{ username: user.username }, 
		{ $push: { games: game } },
	);
	console.log('Added game to user history. User played total games')
}