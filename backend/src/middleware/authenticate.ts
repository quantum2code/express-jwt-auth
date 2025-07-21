import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import AppError from "../utils/AppError";
import { JWT_REFRESH_SECRET } from "../services/auth.services";
import { AccessTokenPayload } from "../controller/auth.controller";

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  if (!accessToken) throw new AppError(401, "Not authorized");

  try {
    const payload = jwt.verify(
      accessToken || "",
      JWT_REFRESH_SECRET
    ) as AccessTokenPayload;
    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();
  } catch (e: any) {
    throw new AppError(
      401,
      e.message === "jwt expired" ? "Token expired" : "Invalid token"
    );
  }
};

export default authenticate;
