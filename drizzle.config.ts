import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/shared/db/migrations",
  schema: ["./src/shared/db/schemas/index.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
