import { EloModel } from "../models/Elo.model";
import { HighscoreInterface, HighscoreModel } from "../models/Highscore.model";

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
	res.send({ success: true, message: "Backend online" });
});

router.post('/sethighscore', async (req, res) => {
	const { user } = req.body;
	const { elo } = req.body;
	const findEloPlayer = await HighscoreModel.findOne({ user })

	if (findEloPlayer)
	{
		const updated = await HighscoreModel.updateOne({ user: user }, {
			elo: elo
		}).exec();
		return res.send( {success: true, message: "Elo set!"} )
	}
	else
	{
		const result = await HighscoreModel.create({
			user: user,
			elo: elo
		})
		console.log(result)
		return res.send( {success: true, message: "Elo created!"} )
	}
	return res.send( {success: false, message: "JSON body incorrect!"} )
});

/**
 * Returns all highscores in the system
 */
router.post('/highscore', async (req, res) => {
	let getHighscores = await HighscoreModel.find({}) as unknown as HighscoreInterface[];
	getHighscores.sort((a, b) => (b.elo?.rank * 100 + b.elo?.points) - (a.elo?.rank * 100 + a.elo?.points));
	return res.send( {success: true, highscores: getHighscores} )
});

module.exports = router