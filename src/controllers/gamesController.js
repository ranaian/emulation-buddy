const emuRepo = require("../repositories/emulationRepository");
const { findByGameTitle } = require("../repositories/emulationRepository");
const wikiService = require("../services/WikipediaService");

const getGameDetails = async (req, res) => {
  try {
    const { title } = req.query;
    console.log("Controller received: ", title);
    let game = await emuRepo.findByGameTitle(title);
    if (!game || game.length === 0) {
      const rawData = await wikiService.getGameData(title);
      if (!rawData || !rawData.title) {
        return res.status(404).json({ error: "Game Not Found" });
      }

      //parse here
      await emuRepo.saveGameAndPlatform(
        rawData.title,
        rawData.wiki_slug,
        rawData.platforms,
      );
      game = findByGameTitle(rawData.title);
    }
    res.status(200).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getGameDetails };
