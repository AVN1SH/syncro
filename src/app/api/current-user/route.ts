import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { apiResponse } from "@/utils/apiResponse";

export async function GET() {

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if(!session || !user) {
    return apiResponse(401, "Unauthorized");
  }

  return apiResponse(200, "Success", user);
}