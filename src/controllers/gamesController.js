const emuRepo = require("../repositories/emulationRepository");
const { findByGameTitle } = require("../repositories/emulationRepository");
const wikiService = require("../services/WikipediaService");

const getGameDetails = async (req, res) => {
  try {
    const { title } = req.query;
    console.log("Controller received: ", title);
    let message = "";
    let game = await emuRepo.findByGameTitle(title);
    if (!game || game.length === 0) {
      const rawData = await wikiService.getGameData(title);
      if (!rawData || !rawData.title) {
        return res.status(404).json({ error: "Game Not Found" });
      }
      const cleanTitle = Array.isArray(rawData.title)
        ? rawData.title[0]
        : rawData.title;
      const cleanSlug = cleanTitle.replace(/ /g, "_");
      const wiki_slug = rawData.slug || cleanSlug;
      game = await emuRepo.findByGameTitle(cleanTitle);
      if (!game || game.length === 0) {
        //const wiki_slug = rawData.title.replace(/ /g, "_");
        //parse here
        await emuRepo.saveGameAndPlatform(
          cleanTitle,
          cleanSlug,
          rawData.platforms,
        );
        game = await emuRepo.findByGameTitle(cleanTitle);
        message = `${cleanTitle} added to database. Please search again for details.`;
      } else {
        message = `${cleanTitle} found in database.`;
      }

      //game = findByGameTitle(rawData.title);
    }
    res
      .status(200)
      .json({ data: game, message: message || "Data retrieved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getAllConsoles = async (req, res) => {
  try {
    const consoles = await emuRepo.findAllConsoles();
    res.status(200).json(consoles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const updateConsoleInfo = async (req, res) => {
  try {
    const { consoleName, emulatorName, emulatorUrl } = req.body;
    await emuRepo.updateEmulatorInfo(consoleName, emulatorName, emulatorUrl);
    res.status(200).json({ message: "Console info updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getGameDetails, getAllConsoles, updateConsoleInfo };
