import {
  integer,
  pgTable,
  varchar,
  PgColumn,
  timestamp,
} from "drizzle-orm/pg-core";
import { thrityDaysFromNow } from "../utils/time";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const sessionTable = pgTable("session", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references((): PgColumn => usersTable.id),
  createdAt: timestamp().defaultNow().notNull(),
  expiresAt: timestamp().default(thrityDaysFromNow()).notNull(),
});
