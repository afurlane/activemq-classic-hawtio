import fs from "fs";

const creedengo = JSON.parse(fs.readFileSync("reports/creedengo.json")).score;
const other = creedengo;

const score = Number(((creedengo + other) / 2).toFixed(2));

fs.writeFileSync(
  "reports/overall.json",
  JSON.stringify({ score, creedengo }, null, 2)
);
