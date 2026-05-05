//const { replace } = import("react-router-dom");

// public/script.js
const searchForm = document.getElementById("search-form");
const gameInput = document.getElementById("game-input");
const resultsContainer = document.getElementById("results");
const consolesButton = document.getElementById("consoles-button");
const consolesList = document.getElementById("consoles-list");

async function checkLoginStatus() {
  try {
    const response = await fetch("/api/session-check");
    const data = await response.json();

    console.log("Session Check Data:", data); // DEBUG 1

    if (data.loggedIn && data.user && data.user.email) {
      console.log("User is logged in, fetching admin status..."); // DEBUG 2
      const adminRes = await fetch(
        `/users/is-admin?email=${encodeURIComponent(data.user.email)}`,
      );
      const adminData = await adminRes.json();

      if (adminData.isAdmin === true) {
        console.log("User is an admin."); // debug 2.5
        document.body.classList.add("logged-in");
      } else {
        console.log("User not confirmed admin"); // debug 2.75
      }
    } else {
      console.log("User is NOT logged in according to server."); // DEBUG 3
    }
  } catch (error) {
    console.error("error checking login status: ", error);
  }
}
window.onload = checkLoginStatus;

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

    if (!data.data || data.data.length === 0) {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "No emulation data found for that title.";
      errorMsg.classList.add("error-message");
      resultsContainer.appendChild(errorMsg);
      return;
    }

    displayResults(data.data);
    if (response.message) {
      showToast(response.message);
    }
  } catch (err) {
    console.error("Frontend Error:", err);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Error finding game. Please try again later.";
    resultsContainer.appendChild(errorMsg);
  }
});

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
    if (item.emulator_url) {
      link.href = item.emulator_url;
      link.textContent = "Download Emulator";
      link.target = "_blank"; // Safety: open in new tab
    } else {
      link.href = "#";
      link.textContent = "No Emulator URL available";
      link.style.color = "gray";
      link.style.pointerEvents = "none"; // Disable click
    }

    gameDiv.append(title, platform, emulator, link);
    fragment.appendChild(gameDiv);
  });

  resultsContainer.appendChild(fragment);
}

consolesButton.addEventListener("click", async () => {
  while (consolesList.firstChild) {
    consolesList.removeChild(consolesList.firstChild);
  }
  try {
    const response = await fetch("/api/games/consoles");
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "No Consoles Found.";
      errorMsg.classList.add("error-message");
      consolesList.appendChild(errorMsg);
      return;
    }
    const list = document.createElement("table");
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headerConsole = document.createElement("th");
    headerConsole.textContent = "Console Name";
    const headerEmulator = document.createElement("th");
    headerEmulator.textContent = "Emulator Name";
    const headerURL = document.createElement("th");
    headerURL.textContent = "Emulator URL";
    const editButton = document.createElement("th");
    editButton.textContent = "Update";
    headerRow.append(headerConsole, headerEmulator, headerURL, editButton);
    header.appendChild(headerRow);
    list.appendChild(header);
    try {
      data.forEach((item) => {
        const row = document.createElement("tr");
        const consoleCell = document.createElement("td");
        consoleCell.textContent = item.console_name || "Unknown Console";
        const emulatorCell = document.createElement("td");
        emulatorCell.textContent = item.emulator_name || "Unknown Emulator";
        const urlCell = document.createElement("td");
        if (item.emulator_url) {
          const link = document.createElement("a");
          let hrefUrl = item.emulator_url;
          if (
            !hrefUrl.startsWith("http://") &&
            !hrefUrl.startsWith("https://")
          ) {
            hrefUrl = "https://" + hrefUrl;
          }
          link.href = hrefUrl;
          let displayUrl = item.emulator_url
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, "");

          link.textContent = displayUrl;
          link.target = "blank";
          urlCell.appendChild(link);
        } else {
          urlCell.textContent = "Unknown Source";
        }
        const editCell = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", async () => {
          const modal = document.getElementById("edit-modal");
          document.getElementById("modal-emulator-name").value = "";
          document.getElementById("modal-emulator-url").value = "";
          modal.style.display = "block";
          if (item.emulator_name) {
            document.getElementById("modal-emulator-name").value =
              item.emulator_name;
          }
          if (item.emulator_url) {
            document.getElementById("modal-emulator-url").value =
              item.emulator_url;
          }
          document.getElementById("modal-console-name").textContent =
            item.console_name;
          document.getElementById("modal-save-button").onclick = async () => {
            const newEmulatorName = document.getElementById(
              "modal-emulator-name",
            ).value;
            const newEmulatorURL =
              document.getElementById("modal-emulator-url").value;
            if (newEmulatorName && newEmulatorURL) {
              try {
                const response = await fetch("/api/games/update-console", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    consoleName: item.console_name,
                    emulatorName: newEmulatorName,
                    emulatorUrl: newEmulatorURL,
                  }),
                });
                if (response.ok) {
                  modal.style.display = "none";
                  showToast("Console info updated successfully!");
                  // update without reloading
                  emulatorCell.textContent = newEmulatorName;
                  urlCell.textContent = "";
                  const link = document.createElement("a");
                  link.href = newEmulatorURL;
                  link.textContent = newEmulatorURL;
                  link.target = "blank";
                  urlCell.appendChild(link);
                } else {
                  const errorData = await response.json();
                  showToast(
                    `Error: ${errorData.error || "Failed to update console info."}`,
                  );
                }
              } catch (error) {
                console.error("Frontend Error: ", error);
              }
            }
          };
          document.getElementById("modal-cancel-button").onclick = () => {
            modal.style.display = "none";
          };
        });
        editCell.appendChild(editButton);

        row.append(consoleCell, emulatorCell, urlCell, editCell);
        list.appendChild(row);
      });
      consolesList.appendChild(list);
    } catch (err) {
      console.error("Frontend Error: ", err);
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Error fetching consoles.";
      consolesList.appendChild(errorMsg);
    }
  } catch (err) {
    console.error("Frontend Error: ", err);
    const errorMsg = document.createElement("p");
    errorMsg.textContent = "Error fetching consoles.";
    consolesList.appendChild(errorMsg);
  }
});

function showToast(message) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
