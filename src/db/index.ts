import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.ts";

const dbPath = process.env.NODE_ENV === "test" ? ":memory:" : "database.sqlite";
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
