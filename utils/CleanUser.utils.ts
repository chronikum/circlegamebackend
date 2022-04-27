import { UserInterface } from "../models/Highscore.model";

/**
 * Removes sensitive information from user object
 * @param user to clean
 * @returns cleaned user
 */
export function cleanUserObject(user: UserInterface) {
	user.password = undefined
	user['_id'] = undefined
	return user;
}

/**
 * Removes sensitive values from User Array
 */
export function cleanUserArray(users: UserInterface[]) {
	users = users.map(u => cleanUserObject(u));
	console.log(users)
	return users
}