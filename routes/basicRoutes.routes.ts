import { EloModel } from "../models/Elo.model";
import { UserInterface, UserModel, userValidationSchema, validateSchema } from "../models/Highscore.model";
import { checkPasswordOfUser, createUserIfNotExistent } from "../UserManager";
import { cleanUserArray } from "../utils/CleanUser.utils";

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../../public/backend_online.html'));
});

/**
 * Check user login and registers the user if necessary
 */
router.post('/login', async (req, res) => {
	const { username } = req.body?.password;
	const { password } = req.body?.user;

	if (!username || !password) {
		return res.send({success: false, message: "I don't like this!"})	
	}
	const result = await checkPasswordOfUser(username, password);
	return res.send({success: result})
});


/**
 * Sets a new highscore
 */
router.post('/sethighscore', validateSchema(userValidationSchema), async (req, res) => {
	const { user } = req.body;
	const findEloPlayer = await UserModel.findOne({ username: user.username })
	// Creates user if not existent or checks the password of the user
	if (await createUserIfNotExistent(user)) {
		console.log("user was created")
	}
	else if (!(await checkPasswordOfUser(user.username, user.password))) {
		console.log("Password is not correct")
		return res.send({success: false, message: "Unable to update score. Password was not correct."})
	}

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

module.exports = router