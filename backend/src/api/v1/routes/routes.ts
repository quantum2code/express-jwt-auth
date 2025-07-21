import { Router } from "express";
import { authRouter } from "./auth.router";
import userRouter from "./user.router";
import authenticate from "../../../middleware/authenticate";

const router = Router();
router.use("/auth", authRouter);
router.use("/user", authenticate, userRouter);

export { router };
