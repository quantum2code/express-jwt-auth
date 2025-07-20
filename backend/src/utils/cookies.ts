import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thrityDaysFromNow } from "./time";
export const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure: false,
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) =>
  res
    .cookie("accessToken", accessToken, {
      ...defaults,
      expires: fifteenMinutesFromNow(),
    })
    .cookie("refreshToken", refreshToken, {
      ...defaults,
      expires: thrityDaysFromNow(),
      path: "/api/v1/auth/refresh",
    });

export const clearAuthCookies = (res: Response) =>
  res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: "/api/v1/auth/refresh",
  });
