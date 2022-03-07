const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
	res.send({ success: true, message: "Backend online" });
});

module.exports = router