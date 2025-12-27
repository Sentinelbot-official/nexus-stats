// Stats fetcher for local use
const https = require("https");
const http = require("http");

const DASHBOARD_URL =
  process.env.DASHBOARD_URL || "https://regular-puma-clearly.ngrok-free.app";

function fetchStats() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${DASHBOARD_URL}/api/stats`);
    const client = url.protocol === "https:" ? https : http;

    const options = {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };

    client
      .get(url.toString(), options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const stats = JSON.parse(data);
            resolve(stats);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// If run directly (not imported), just fetch and exit silently
// The stats.html file handles all display
if (require.main === module) {
  fetchStats()
    .then(() => {
      // Stats fetched successfully - HTML file will display them
      process.exit(0);
    })
    .catch(() => {
      // Silent failure - HTML file will handle error display
      process.exit(1);
    });
}

module.exports = { fetchStats };
