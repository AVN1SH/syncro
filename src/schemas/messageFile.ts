import {z} from "zod";

export const messageFile = z.object({
  fileUrl : z.string().min(1, {
    message : "File is required"
  })
});