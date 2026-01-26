import fs from "fs";

function badge(score, label) {
  const color =
    score >= 90 ? "brightgreen" :
    score >= 75 ? "green" :
    score >= 60 ? "yellowgreen" :
    score >= 45 ? "yellow" :
    score >= 30 ? "orange" :
    "red";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="20">
  <rect width="70" height="20" fill="#555"/>
  <rect x="70" width="80" height="20" fill="${color}"/>
  <text x="35" y="14" fill="#fff" font-family="Verdana" font-size="11">${label}</text>
  <text x="110" y="14" fill="#fff" font-family="Verdana" font-size="11">${score}</text>
</svg>`;
}

const eco = JSON.parse(fs.readFileSync("reports/ecocode.json")).score;
const gf = JSON.parse(fs.readFileSync("reports/greenframe.json")).score;
const overall = JSON.parse(fs.readFileSync("reports/overall.json")).score;

fs.writeFileSync("badges/ecocode.svg", badge(eco, "ECOCode"));
fs.writeFileSync("badges/greenframe.svg", badge(gf, "GreenFrame"));
fs.writeFileSync("badges/overall.svg", badge(overall, "Overall"));
