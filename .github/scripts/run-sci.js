import { run } from "@grnsft/if";
import fs from "fs";

async function main() {
  try {
    const result = await run("sci.config.json");

    fs.writeFileSync(
      "sci-report.json",
      JSON.stringify(result, null, 2)
    );

    console.log("SCI report generated successfully.");
  } catch (err) {
    console.error("SCI execution failed:", err);
    process.exit(1);
  }
}

main();
