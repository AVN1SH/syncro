import {z} from "zod";

export const newConnection = z.object({
  name : z.string().min(3, "Name must contain atleast 3 Charecters").max(20, "Name must be less than 20 Charecters"),
  profilePhotoUrl : z.string().optional()
});