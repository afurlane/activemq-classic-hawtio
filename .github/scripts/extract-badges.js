const fs = require("fs");

// SCI
const sci = JSON.parse(fs.readFileSync("sci-report.json", "utf8"));
const sciValue = sci?.summary?.co2e || "n/a";

// ECOCode
const eco = JSON.parse(fs.readFileSync("ecocode-report.json", "utf8"));
const ecoIssues = eco?.issues?.length || 0;

// GreenFrame
const gf = JSON.parse(fs.readFileSync("greenframe-report.json", "utf8"));
const gfValue = gf?.summary?.co2e || "n/a";

// Badge JSON format for Shields.io
function badge(label, message, color) {
  return JSON.stringify({
    schemaVersion: 1,
    label,
    message,
    color
  });
}

// Overall score
const overall = (
  parseFloat(sciValue) +
  parseFloat(gfValue) +
  ecoIssues * 0.01
).toFixed(2);

fs.writeFileSync(
  "overall.json",
  badge("Overall Score", `${overall}`, overall < 1 ? "green" : "orange")
);

// Write badge files
fs.writeFileSync("sci.json", badge("SCI CO₂", `${sciValue} g`, "green"));
fs.writeFileSync("ecocode.json", badge("Eco Issues", `${ecoIssues}`, ecoIssues > 0 ? "orange" : "green"));
fs.writeFileSync("greenframe.json", badge("Frontend CO₂", `${gfValue} g`, "green"));
