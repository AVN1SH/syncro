import {z} from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 charecters long").max(30, "Name must be under 30 charecters").regex(/^[a-zA-Z]+$/, "Name must only contain letters"),
  username: z.string().min(3, "Username must be atleast 3 charecters long").max(30, "Username must be under 30 charecters").regex(/^[a-zA-Z]+$/, "Username must only contain letters"),
  email: z.string().email({message : "Invalid email address"}),
  password: z.string().min(8, "Password must be atleast 8 charecters long").max(20, "Password must be shorter than 20 charecters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
  confirmPassword : z.string()
});