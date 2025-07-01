import bcrypt from "bcrypt";
export const hashValue = (value: string, saltRounds?: number) =>
  bcrypt.hashSync(value, saltRounds || 10);

export const compareValue = (value: string, hashedValue: string) =>
  bcrypt.compareSync(value, hashedValue);
