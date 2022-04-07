import { HighscoreInterface, HighscoreModel } from "../models/Highscore.model";

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
	res.send({ success: true, message: "Backend online" });
});

router.post('/sethighscore', async (req, res) => {
	const { user } = req.body;
	const { highscore } = req.body;

	if (user && highscore)
	{
		let currentHighscore = await HighscoreModel.findOne({ user }) as unknown as HighscoreInterface;
		// highscore exists and maybe needs an update
		if (currentHighscore)
		{
			if (currentHighscore.highscore >= highscore) // highscore is not higher than saved score
			{
				return res.send({success: false, message: "Highscore is not higher than current highscore"});
			}
			else // update existing entry with highscore
			{
				const updated = await HighscoreModel.updateOne({ user: user }, {
					highscore: highscore
				}).exec();
				return res.send( {success: true, message: "Highscore updated!"} )
			}
		}
		else
		{
			const createNewHighscore = HighscoreModel.create({
				user: user,
				highscore: highscore
			})
		}
		return res.send( {success: true, message: "Highscore added!"} )
	}
	return res.send( {success: false, message: "JSON body incorrect!"} )
});

/**
 * Returns all highscores in the system
 */
router.post('/highscore', async (req, res) => {
	let getHighscores = await HighscoreModel.find({}) as unknown as HighscoreInterface[];
	getHighscores.sort((a, b) => b.highscore - a.highscore);
	return res.send( {success: true, highscores: getHighscores} )
});

module.exports = router