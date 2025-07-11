import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./index.ts";

export function runMigrations() {
  migrate(db, { migrationsFolder: "./src/db/migrations" });
}
