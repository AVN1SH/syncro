import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SessionUser } from "@/types";
import { getServerSession } from "next-auth";

interface Session {
  user : SessionUser;
}

export async function currentUser () {
  const session : Session | null = await getServerSession(authOptions);
  if(!session) {
    return null;
  }
  return session.user;
}