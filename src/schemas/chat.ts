import {z} from "zod";

export const chat = z.object({
  content : z.string().min(1, "Content must contain atleast 1 Charecters").max(1000, "Content must be less than 200 Charecters"),
});