import "dotenv/config";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { signUpSchema } from "../controller/auth.controller";
import { db } from "../db";
import { sessionTable, usersTable } from "../db/schema";
import { hashValue } from "../utils/bcrypt";
import AppError from "../utils/AppError";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "someSecret";

export const createUser = async (userData: z.infer<typeof signUpSchema>) => {
  //check if user already exists
  const existingUser = await db.query.usersTable.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.email, userData.email),
  });
  if (existingUser) {
    throw new AppError(409, "Email already in use");
  }

  const hashedPass = hashValue(userData.password);
  const user = await db
    .insert(usersTable)
    .values({
      name: userData.name,
      email: userData.email,
      password: hashedPass,
    })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    });

  //create a session
  const createdSession = await db
    .insert(sessionTable)
    .values({ userId: user[0].id })
    .returning({ id: sessionTable.id, userId: sessionTable.userId });

  //sign access and refresh tokens
  const refreshToken = jwt.sign(
    {
      sessionId: createdSession[0].id,
    },
    JWT_REFRESH_SECRET,
    { audience: ["user"], expiresIn: "30d" }
  );

  const accessToken = jwt.sign(
    {
      userId: createdSession[0].userId,
      sessionId: createdSession[0].id,
    },
    JWT_REFRESH_SECRET,
    { audience: ["user"], expiresIn: "15min" }
  );
  return { user, refreshToken, accessToken };
};
