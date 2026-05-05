const express = require("express");
const router = express.Router();

const { getGameDetails } = require("../controllers/gamesController");
const { getAllConsoles } = require("../controllers/gamesController");
const { updateConsoleInfo } = require("../controllers/gamesController");
router.get("/search", getGameDetails);
router.get("/consoles", getAllConsoles);
router.post("/update-console", updateConsoleInfo);

module.exports = router;
