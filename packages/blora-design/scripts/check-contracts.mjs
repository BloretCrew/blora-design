/**
 * Contract checker stub.
 * Spec §5.4 requires: check-api.mjs + check-css-contract.mjs
 * Phase 1 stub: validates that all contract JSON files in contracts/
 * conform to the component-contract.schema.json schema.
 * Phase 4+ will extend with full API/CSS contract comparison.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const contractsDir = resolve(import.meta.dirname, "..", "contracts");
const schemaPath = resolve(import.meta.dirname, "..", "schemas", "component-contract.schema.json");

if (!existsSync(contractsDir) || readdirSync(contractsDir).length === 0) {
  console.log("[check-contracts] No contract files found yet. Phase 4+ will add them.");
  process.exit(0);
}

if (!existsSync(schemaPath)) {
  console.error("[check-contracts] Schema file not found:", schemaPath);
  process.exit(1);
}

const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));

let errors = 0;
for (const file of readdirSync(contractsDir)) {
  if (!file.endsWith(".contract.json")) continue;
  const filePath = join(contractsDir, file);
  const contract = JSON.parse(readFileSync(filePath, "utf-8"));

  // Basic required field check (full JSON Schema validation added in Phase 4)
  for (const field of schema.required) {
    if (!(field in contract)) {
      console.error(`[check-contracts] ${file}: missing required field "${field}"`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`[check-contracts] ${errors} error(s) found.`);
  process.exit(1);
}

console.log("[check-contracts] All contracts valid.");
