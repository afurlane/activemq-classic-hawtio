import fs from "fs";

const backend = JSON.parse(fs.readFileSync("reports/ecocode-backend.json"));
const frontend = JSON.parse(fs.readFileSync("reports/ecocode-frontend.json"));

const score = (backend.score + frontend.score) / 2;

fs.writeFileSync(
  "reports/ecocode.json",
  JSON.stringify({ score, backend, frontend }, null, 2)
);
