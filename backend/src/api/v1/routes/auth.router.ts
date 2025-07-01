import { Router } from "express";
import { signUpHandler } from "../../../controller/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signUpHandler);

export { authRouter };
