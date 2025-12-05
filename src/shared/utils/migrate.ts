import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    process.exit(1);
  }

  console.log("🔄 Connecting to database via HTTP...");

  try {
    // Use Neon's HTTP-based client (works better through firewalls)
    const sql = neon(databaseUrl);
    const db = drizzle({ client: sql });

    console.log("✅ Connected to database");
    console.log("🔄 Running migrations...");

    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../db/migrations"),
    });

    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
