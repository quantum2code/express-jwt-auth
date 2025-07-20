import { Router } from "express";
import {
  logInHandler,
  logOutHandler,
  refreshHandler,
  signUpHandler,
} from "../../../controller/auth.controller";

const authRouter = Router();

authRouter.post("/signup", signUpHandler);
authRouter.post("/login", logInHandler);
authRouter.get("/logout", logOutHandler);
authRouter.get("/refresh", refreshHandler);

export { authRouter };
