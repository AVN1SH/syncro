import {z} from "zod";

export const signInSchema = z.object({
  email: z.string().email({message : "Invalid email address"}),
  password: z.string().min(8).max(20).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});