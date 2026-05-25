import fs from "fs";

const results = JSON.parse(fs.readFileSync("reports/creedengo.json"));

let creedengoErrors = 0;
let creedengoWarnings = 0;
let totalErrors = 0;
let totalWarnings = 0;

for (const file of results) {
  console.log(`Processing: ${file.filePath}`);

  // ESLint garantisce messages = [] ma non si sa mai
  const messages = Array.isArray(file.messages) ? file.messages : [];

  for (const msg of messages) {
    const rule = msg.ruleId || "";

    // Solo regole Creedengo
    if (rule.startsWith("creedengo/")) {
      if (msg.severity === 2) creedengoErrors++;
      if (msg.severity === 1) creedengoWarnings++;
    }
  }

  totalErrors += file.errorCount || 0;
  totalWarnings += file.warningCount || 0;
}

const creedengoScore = Math.max(
  0,
  100 - creedengoErrors * 10 - creedengoWarnings * 2
);

const totalScore = Math.max(
  0,
  100 - totalErrors * 1 - totalWarnings * 1
);

fs.writeFileSync(
  "reports/overall.json",
  JSON.stringify(
    {
      creedengo: creedengoScore,
      total: totalScore,
      creedengoErrors,
      creedengoWarnings,
      totalErrors,
      totalWarnings
    },
    null,
    2
  )
);
