import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

export function createDatabaseClient(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be defined to create the database client");
  }

  const client = postgres(databaseUrl, {
    max: 10,
    prepare: false,
  });

  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDatabaseClient>;
