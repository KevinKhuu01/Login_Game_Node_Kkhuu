function loadScoreboard() {
	// Change this to fetch from the API endpoint instead of directly from the public folder
	fetch("/.netlify/functions/scoreboard")
		.then((response) => response.json())
		.then((scoreboard) => {
			const tableBody = document.getElementById("winnerTable");

			// Remove all rows except the header row
			while (tableBody.rows.length > 1) {
				tableBody.deleteRow(1);
			}

			// Add each scoreboard entry as a new row
			scoreboard.forEach((entry, index) => {
				const row = tableBody.insertRow();

				// Rank cell
				const rankCell = row.insertCell();
				rankCell.textContent = `#${index + 1}`;

				// Name cell
				const nameCell = row.insertCell();
				nameCell.textContent = entry.name;

				// Email cell
				const emailCell = row.insertCell();
				emailCell.textContent = entry.email;

				// Time cell
				const timeCell = row.insertCell();
				timeCell.textContent = `${Math.floor(entry.time / 60)}:${(
					entry.time % 60
				)
					.toString()
					.padStart(2, "0")}
				`;

				// Highlight the most recent entry (assuming it's the player's entry)
				// This assumes the most recent entry is the last one in the list
				if (index === scoreboard.length - 1) {
					row.classList.add("player-entry");
				}
			});

			// Find and highlight the current player's entry
			highlightPlayerEntry();
		})
		.catch((error) => console.error("Error loading scoreboard:", error));
}

// Function to highlight the current player's entry
function highlightPlayerEntry() {
	// Get player info from URL parameters (if passed from game completion)
	const urlParams = new URLSearchParams(window.location.search);
	const playerName = urlParams.get("name");
	const playerEmail = urlParams.get("email");

	if (playerName && playerEmail) {
		const rows = document.querySelectorAll("#winnerTable tr");

		// Skip header row (index 0)
		for (let i = 1; i < rows.length; i++) {
			const cells = rows[i].cells;
			const rowName = cells[1].textContent;
			const rowEmail = cells[2].textContent;

			if (rowName === playerName && rowEmail === playerEmail) {
				rows[i].classList.add("player-entry");
				break;
			}
		}
	}
}

// Load scoreboard when page loads
document.addEventListener("DOMContentLoaded", loadScoreboard);
