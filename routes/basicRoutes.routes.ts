import { EloModel } from "../models/Elo.model";
import { UserInterface, UserModel, userValidationSchema, validateSchema } from "../models/Highscore.model";
import { addGameToUserHistory, checkPasswordOfUser, createUserIfNotExistent } from "../UserManager";
import { cleanUserArray, cleanUserObject } from "../utils/CleanUser.utils";

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/backend_online.html'));
});

/**
 * Check user login and registers the user if necessary.
 * Returns the user object with the highscore
 */
router.post('/login', async (req, res) => {
	const { username } = req.body;
	const { password } = req.body;

	console.log("Just saw a login!")
	console.log("Receiving body:" + JSON.stringify(req.body))

	if (!username || !password) {
		return res.send({success: false})
	}
	if (await createUserIfNotExistent(req.body)) {
		console.log("user was created: " + username)
	}
	const result = await checkPasswordOfUser(username, password);
	if (result) {
		const user = await UserModel.findOne({ username: username })
		return res.send(cleanUserObject(user))
	}
	return res.send({success: result})
});


/**
 * Sets a new highscore
 */
router.post('/sethighscore', validateSchema(userValidationSchema), async (req, res) => {
	const user = req.body;
	const findEloPlayer = await UserModel.findOne({ username: user.username })
	// Creates user if not existent or checks the password of the user
	if (await createUserIfNotExistent(user)) {
		console.log("user was created")
	}
	else if (!(await checkPasswordOfUser(user.username, user.password))) {
		console.log("Password is not correct")
		return res.send({success: false, message: "Unable to update score. Password was not correct."})
	}

	// update existing player and set timestamp
	user.elo.timestamp = Date.now();
	addGameToUserHistory(user, user.elo),
	if (findEloPlayer)
	{
		const updated = await UserModel.updateOne({ username: user.username }, {
			elo: user.elo
		}).exec();
		return res.send( {success: true, message: "Elo set!"} )
	}
	else
	{
		const result = await UserModel.create({
			user: user,
			elo: user.elo
		})
		console.log(result)
		return res.send( {success: true, message: "Elo created!"} )
	}
});

/**
 * Returns all highscores in the system
 */
router.post('/highscore', async (req, res) => {
	let getHighscores = await UserModel.find({}) as unknown as UserInterface[];
	getHighscores.sort((a, b) => (b.elo?.rank * 100 + b.elo?.points) - (a.elo?.rank * 100 + a.elo?.points));
	return res.send( {success: true, highscores: cleanUserArray(getHighscores)} )
});


/**
 * 
 * ADMIN ROUTES !!!
 * 
 */


/**
 * Forgot password? Reset it here!
 */
router.post('/admin/forgot', async (req, res) => {
	const { userToReset } = req.body;
});

/**
 * Want to delete an user? Do it here!
 */
router.post('/admin/delete', async (req, res) => {
	const { userToDelete } = req.body;
});

module.exports = router