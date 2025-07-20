import { sessionTable } from "./../db/schema";
import jwt, { JwtPayload } from "jsonwebtoken";
import { clearAuthCookies, defaults, setAuthCookies } from "./../utils/cookies";
import { z } from "zod";
import { catchErrors } from "../utils/catchErrors";
import {
  createUser,
  JWT_REFRESH_SECRET,
  logInUser,
  RefreshUserAccessToken,
} from "../services/auth.services";
import { PgColumn } from "drizzle-orm/pg-core";
import { db } from "../db";
import { eq } from "drizzle-orm";
import AppError from "../utils/AppError";
import { fifteenMinutesFromNow, thrityDaysFromNow } from "../utils/time";

export const signUpSchema = z
  .object({
    name: z.string().min(3).max(100),
    email: z.string().max(255).email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((schema) => schema.confirmPassword === schema.password, {
    message: "Password and confirm password should be same",
    path: ["confirmPassword"],
  });

export const logInSchema = z.object({
  email: z.string().max(255).email(),
  password: z.string().min(6),
});

export const signUpHandler = catchErrors(async (req, res) => {
  //validate the signUpSchema
  const request = signUpSchema.parse({
    ...req.body,
  });

  //call services
  const { user, refreshToken, accessToken } = await createUser(request);

  //return response
  return setAuthCookies(res, accessToken, refreshToken).status(200).json(user);
});

export const logInHandler = catchErrors(async (req, res) => {
  //validate login req schema
  const request = logInSchema.parse(req.body);

  //call service
  const { accessToken, refreshToken } = await logInUser(request);

  return setAuthCookies(res, accessToken, refreshToken)
    .status(200)
    .json({ message: "user logged in" });
});

export type RefreshTokenPayload = {
  sessionId: number;
};

export type AccessTokenPayload = {
  userId: number;
  sessionId: number;
};

export const logOutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const payload = jwt.verify(accessToken, JWT_REFRESH_SECRET, {
    audience: ["user"],
  }) as AccessTokenPayload;

  if (payload) {
    await db.delete(sessionTable).where(eq(sessionTable.id, payload.sessionId));
  }

  return clearAuthCookies(res)
    .status(200)
    .json({ message: "logout successful" });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new AppError(401, "Missing refresh token!");

  //call the refresh service
  const { accessToken, newRefreshToken } = await RefreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", refreshToken, {
      ...defaults,
      expires: thrityDaysFromNow(),
      path: "/auth/refresh",
    });
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...defaults,
      expires: fifteenMinutesFromNow(),
    })
    .json({ message: "Access token refreshed" });
});
