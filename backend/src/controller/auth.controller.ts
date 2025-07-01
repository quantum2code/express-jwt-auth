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
  const signUpRes = signUpSchema.parse({
    ...req.body,
  });

  //call services
  const createdUser = await createUser(signUpRes);

  //return response
  res.status(200).json(createdUser);
});
