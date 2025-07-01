import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const dbConnect = () => {
  try {
    const db = drizzle(pool, { schema: schema });
    return db;
  } catch (error) {
    console.error("DB_CONNECTION_FAILED:\n", error);
    process.exit(1);
  }
};

export const db = dbConnect();
