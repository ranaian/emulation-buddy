// public/script.js
const searchForm = document.getElementById("search-form");
const gameInput = document.getElementById("game-input");
const resultsContainer = document.getElementById("results");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Button clicked");
  const query = gameInput.value;
  console.log("Query : ", query);
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }
  try {
    console.log("trying query... ");
    const response = await fetch(
      `/api/games/search?title=${encodeURIComponent(query)}`,
    );
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "No emulation data found for that title.";
      errorMsg.classList.add("error-message");
      resultsContainer.appendChild(errorMsg);
      return;
    }

    displayResults(data);
  } catch (err) {
    console.error("Frontend Error:", err);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Error finding game. Please try again later.";
    resultsContainer.appendChild(errorMsg);
  }
});

/* function displayResults(consoles) {
  resultsContainer.innerHTML = ""; // Clear previous results

  consoles.map((item) => {
    console.log("Current item from DB:", item);
    const gameDiv = document.createElement("div");
    gameDiv.innerHTML = `
            <h3>${item.console_name}</h3> 
            <p>Emulator: ${item.emulator_name}</p>
            <a href="${item.emulator_url}">Download Emulator</a>
        `;
    resultsContainer.appendChild(gameDiv);
  });
}
 */
function displayResults(consoles) {
  const fragment = document.createDocumentFragment();

  consoles.forEach((item) => {
    const gameDiv = document.createElement("div");
    gameDiv.classList.add("game-card");

    const title = document.createElement("h3");
    title.textContent = item.game_name || "Unknown Game";

    const platform = document.createElement("p");
    const platformLabel = document.createElement("strong");
    platformLabel.textContent = "Platform: ";
    platform.appendChild(platformLabel);
    platform.appendChild(document.createTextNode(item.console_name || "N/A"));

    const emulator = document.createElement("p");
    const emulatorLabel = document.createElement("strong");
    emulatorLabel.textContent = "Emulator: ";
    emulator.appendChild(emulatorLabel);
    emulator.appendChild(document.createTextNode(item.emulator_name || "N/A"));

    const link = document.createElement("a");
    link.href = item.emulator_url || "#";
    link.textContent = "Download Emulator";
    link.target = "_blank"; // Safety: open in new tab

    gameDiv.append(title, platform, emulator, link);
    fragment.appendChild(gameDiv);
  });

  resultsContainer.appendChild(fragment);
}
