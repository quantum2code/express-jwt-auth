import { z } from "zod";
import { signUpSchema } from "../controller/auth.controller";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { hashValue } from "../utils/bcrypt";

export const createUser = async (userData: z.infer<typeof signUpSchema>) => {
  const existingUser = await db.query.usersTable.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.email, userData.email),
  });
  if (existingUser) throw new Error("User already exists");

  const hashedPass = hashValue(userData.password);
  const user = await db
    .insert(usersTable)
    .values({
      name: userData.name,
      email: userData.email,
      password: hashedPass,
    })
    .returning({ name: usersTable.name, email: usersTable.email });
  return user;
};
