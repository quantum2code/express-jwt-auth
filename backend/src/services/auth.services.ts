import { eq } from "drizzle-orm";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  logInSchema,
  RefreshTokenPayload,
  signUpSchema,
} from "../controller/auth.controller";
import { db } from "../db";
import { sessionTable, usersTable } from "../db/schema";
import { hashValue } from "../utils/bcrypt";
import AppError from "../utils/AppError";
import { compare } from "bcrypt";
import { ONE_DAY_IN_MS, thrityDaysFromNow } from "../utils/time";

export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "someSecret";

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
  return {
    user: {
      name: user[0].name,
      email: user[0].email,
    },
    refreshToken,
    accessToken,
  };
};

export const logInUser = async (loginData: z.infer<typeof logInSchema>) => {
  const user = await db.query.usersTable.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.email, loginData.email),
  });

  if (!user) {
    throw new AppError(400, "Invalid email or password");
  }

  const isPassword = await compare(loginData.password, user.password);
  if (!isPassword) {
    throw new AppError(400, "Invalid email or password");
  }
  const createdSession = await db
    .insert(sessionTable)
    .values({
      userId: user.id,
    })
    .returning({ id: sessionTable.id, userId: sessionTable.userId });

  //sign the tokens

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
  const { password, createdAt, updatedAt, id, ...safeUser } = user;
  return {
    user: safeUser,
    refreshToken,
    accessToken,
  };
};

export const RefreshUserAccessToken = async (refreshToken: string) => {
  const { sessionId } = jwt.verify(
    refreshToken,
    JWT_REFRESH_SECRET
  ) as RefreshTokenPayload;

  if (!sessionId) throw new AppError(401, "Invalid refresh token");

  const session = await db.query.sessionTable.findFirst({
    where: (sessionTable, { eq }) => eq(sessionTable.id, sessionId),
  });

  const now = Date.now();
  if (!session) throw new AppError(401, "Invalid session");
  if (session?.expiresAt.getTime() < now)
    throw new AppError(401, "Session expired");

  //refresh session if about to exprie in 24 hours
  const sessionNeedsRefresh =
    session?.expiresAt.getTime() - now <= ONE_DAY_IN_MS;

  if (sessionNeedsRefresh) {
    await db
      .update(sessionTable)
      .set({ expiresAt: thrityDaysFromNow() })
      .where(eq(sessionTable.id, sessionId));
  }

  const accessToken = jwt.sign(
    {
      userId: session.userId,
      sessionId: session.id,
    },
    JWT_REFRESH_SECRET,
    { audience: ["user"], expiresIn: "15min" }
  );

  const newRefreshToken = sessionNeedsRefresh
    ? jwt.sign({ sessionId: session.id }, JWT_REFRESH_SECRET, {
        audience: ["user"],
        expiresIn: "30d",
      })
    : undefined;

  return {
    accessToken,
    newRefreshToken,
  };
};
