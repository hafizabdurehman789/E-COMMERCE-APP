import { config } from "dotenv";
config(); // load from backend/.env

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  console.log("Connecting to:", url.replace(/:[^@]+@/, ":***@"));

  const sql = neon(url);

  const migration = readFileSync("drizzle/0000_careless_power_pack.sql", "utf-8");

  // Split on drizzle's statement breakpoint markers
  const statements = migration
    .split(/-->\s*statement-breakpoint/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Applying ${statements.length} statements...\n`);

  for (let i = 0; i < statements.length; i++) {
    const preview = statements[i].split("\n")[0].substring(0, 60);
    console.log(`[${i + 1}/${statements.length}] ${preview}...`);
    try {
      await sql.query(statements[i]);
      console.log(`  ✓ Done`);
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        console.log(`  ⚠ Already exists, skipping`);
      } else {
        console.error(`  ✗ Error:`, err.message);
        process.exit(1);
      }
    }
  }

  console.log("\n✅ All migrations applied successfully!");
}

main();

