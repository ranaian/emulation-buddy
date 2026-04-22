const mapPlatform = (rawPlatform) => {
  const consoleMap = {
    PS4: "Playstation 4",
    PS3: "Playstation 3",
    PS: "Playstation",
    Switch: "Nintendo Switch",
    GB: "Game Boy",
    GBA: "Game Boy Advance",
    NDS: "Nintendo DS",
    "3DS": "Nintendo 3DS",
    NES: "Nintendo Entertainment System",
    SNES: "Super Nintendo Entertainment System",
    GC: "Nintendo GameCube",
    N64: "Nintendo 64",
    //increase as necessary
  };

  if (!rawPlatform) return null;
  const upperPlatform = rawPlatform.trim().toUpperCase();
  const cleanPlatform = rawPlatform
    .replace(/\[\[|\]\]/g, "")
    .split("|")[0]
    .trim();
  if (consoleMap[cleanPlatform]) {
    return consoleMap[cleanPlatform];
  }

  return consoleMap[cleanPlatform] || rawPlatform.trim();
};

module.exports = { mapPlatform };
