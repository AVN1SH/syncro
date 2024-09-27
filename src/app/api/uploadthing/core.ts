import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) throw new UploadThingError("Unauthorized");

  return {userId : session.user._id};
}

export const ourFileRouter = {
  connectionImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  messageFile: f(["image", "pdf", "text"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
