import { setAuthCookies } from "./../utils/cookies";
import { z } from "zod";
import { catchErrors } from "../utils/catchErrors";
import { createUser } from "../services/auth.services";

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

export const signUpHandler = catchErrors(async (req, res) => {
  //validate the signUpSchema
  const request = signUpSchema.parse({
    ...req.body,
  });

  //call services
  const { user, refreshToken, accessToken } = await createUser(request);

  //return response
  return setAuthCookies(res, accessToken, refreshToken)
    .status(200)
    .json({ name: user[0].name, email: user[0].email });
});
