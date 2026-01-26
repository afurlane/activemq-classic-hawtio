import fs from "fs";

const eco = JSON.parse(fs.readFileSync("reports/ecocode.json")).score;
const gf = JSON.parse(fs.readFileSync("reports/greenframe.json")).score;

const score = Number(((eco + gf) / 2).toFixed(2));

fs.writeFileSync(
  "reports/overall.json",
  JSON.stringify({ score, eco, gf }, null, 2)
);
