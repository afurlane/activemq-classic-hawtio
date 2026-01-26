import fs from "fs";

const data = JSON.parse(fs.readFileSync("reports/greenframe.json"));
const score = data.summary.ecoIndex;

fs.writeFileSync(
  "reports/greenframe.json",
  JSON.stringify({ score, raw: data }, null, 2)
);
