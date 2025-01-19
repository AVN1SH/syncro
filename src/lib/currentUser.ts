import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function currentUser () {
  const session = await getServerSession(authOptions);
  if(!session) {
    return null;
  }
  return session.user;
}