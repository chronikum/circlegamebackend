
import { hash } from "argon2";
import { UserInterface, UserModel } from "./models/Highscore.model";

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
		const hashedValue = await argon2.hash(user.pass);
		user.pass = hashedValue;
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
		if (await argon2.verify(playerExists.pass, password)) {
			return true
		} else {
			return false
		}
	} catch (err) {
		console.log("Argon2 error: " + err)
		return false
	}
}