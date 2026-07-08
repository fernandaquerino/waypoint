import { config as loadEnvironment } from "dotenv";
import { defineConfig } from "drizzle-kit";

loadEnvironment({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be defined to run Drizzle commands");
}

export default defineConfig({
  schema: "./packages/db/src/schema/index.ts",
  out: "./packages/db/drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: databaseUrl,
  },
});
