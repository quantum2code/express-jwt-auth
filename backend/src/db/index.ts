import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const dbConnect = () => {
  try {
    const db = drizzle({ client: pool });
    return db;
  } catch (error) {
    console.error("DB_CONNECTION_FAILED:\n", error);
    process.exit(1);
  }
};

export const db = dbConnect();
