import { db } from "../db";
import AppError from "../utils/AppError";
import { catchErrors } from "../utils/catchErrors";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await db.query.usersTable.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.id, req.userId),
  });
  if (!user) throw new AppError(401, "User not found");
  const { password, ...safeUser } = user;
  return res.status(200).json(safeUser);
});
