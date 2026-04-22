const express = require("express");
const router = express.Router();

const { getGameDetails } = require("../controllers/gamesController");
router.get("/search", getGameDetails);
module.exports = router;
