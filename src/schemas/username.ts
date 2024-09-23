import {z} from "zod";
export const usernameSchema = z.object({
  username: z.string().min(3, "Username must be atleast 3 charecters long").max(30, "Username must be under 30 charecters").regex(/^[a-zA-Z0-9_-]+$/, "Username must only contain letters, number, underscore and hyphen"),
});