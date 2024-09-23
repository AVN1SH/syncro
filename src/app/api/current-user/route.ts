import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { apiResponse } from "@/utils/apiResponse";
import UserModel, { User } from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(request : Request) {

  const session = await getServerSession(authOptions);
  const user : User = session?.user;
  console.log(user);

  if(!session || !user) {
    return apiResponse(401, "Unauthorized");
  }

  return apiResponse(200, "Success", user);
}