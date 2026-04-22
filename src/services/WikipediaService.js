//import parseInfo from "infobox-parser";
const { raw } = require("express");
const parseInfo = require("infobox-parser");
const { mapPlatform } = require("../utils/consoleNameMapper");

async function getGameData(gameTitle) {
  const endpoint = "https://en.wikipedia.org/w/api.php";

  const params = new URLSearchParams({
    action: "parse",
    page: gameTitle,
    prop: "wikitext",
    section: 0,
    format: "json",
    redirects: "true",
    origin: "*",
  });

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Api-User-Agent": "EmulationBuddyWikibot/0.0 (github.com/ranaian)",
      },
    });
    if (!response.ok) {
      console.log(`HTTP Error Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error || !data.parse) {
      console.log(`Page Not Found on Wikipedia for ${gameTitle}`);
      return null;
    }
    const wikiSlug = data.parse.title.replace(/ /g, "_");
    const rawWikiText = data.parse.wikitext["*"];
    const parsedData = parseInfo(rawWikiText);
    if (!parsedData || !parsedData.general) {
      console.log(`[Wiki] parser failed to find general info for ${gameTitle}`);
      return null;
    }
    const info = parseInfo(rawWikiText).general;
    const rawPlatforms = Array.isArray(info.platforms)
      ? info.platforms
      : [info.platforms];
    return {
      title: info.title || data.parse.title || gameTitle,
      slug: wikiSlug,
      platforms: rawPlatforms.map((p) => mapPlatform(p)),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

module.exports = { getGameData };
