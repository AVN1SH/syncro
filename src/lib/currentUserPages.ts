import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SessionUser } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

interface Session {
  user : SessionUser;
}

export async function currentUserPage (req : NextApiRequest, res : NextApiResponse) {
  const session : Session | null = await getServerSession(req, res, authOptions);
  if(!session) {
    return null;
  }
  return session.user;
}