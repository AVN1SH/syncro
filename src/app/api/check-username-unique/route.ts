import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from "zod";
import { usernameSchema } from "@/schemas/username";

const usernameQuerySchema = z.object({
  username: usernameSchema
});

export async function GET(Request : Request) {
  await dbConnect();

  try {

    const {searchParams} = new URL(Request.url);
    const queryParams = {username : searchParams.get("username")}
    console.log(queryParams);

    const result = usernameSchema.safeParse(queryParams);
    console.log(result);
    console.log(result.error?.format())

    if(!result.success) {
      return Response.json({
        success : false,
        message: result.error.format().username?._errors || "username is not valid"
      }, {status : 400});
    }
    
    const uniqueUsernameCheck = await UserModel.findOne({username : result.data.username});

    if(uniqueUsernameCheck) {
      return Response.json({
        success : false,
        message: "Username already exists"
      }, {status : 400});
    }

    return Response.json({
      success : true,
      message: "Username is unique"
    }, {status : 200});
    
  } catch (error) {
    console.error("Error while checking username");
    return Response.json({
      success : false,
      message: "Error while checking username"
    }, {status : 500})
  }
}