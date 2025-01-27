import Thread from "@/model/thread.model";
import {z} from "zod";

export const threadType = ["text", "voice", "video"] as const;

export const newThread = z.object({
  name : z.string().min(3, "Name must contain atleast 3 Charecters").max(20, "Name must be less than 20 Charecters")
  .refine(
    name => name !== "general",
  {
    message : "Thread name cannot be 'general'",
  }
  ),
  type : z.enum(threadType)
});