import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import { NextResponse } from "next/server";
import { generateInviteCode } from "../../../new-connection/route";

export async function PATCH(
  req : Request,
  {params} : {params : {connectionId : string}}
) {
  try {
    const user = await currentUser();

    if(!user) {
      return new NextResponse("Unauthorized", {status : 401});
    }

    if(!params.connectionId) {
      return new NextResponse("Connection ID Missing", {status : 400});
    }

    await dbConnect();

    const connection = await ConnectionModel.findOneAndUpdate(
      {
        _id : params.connectionId,
        user : user._id
      },
      {
        $set : {
          inviteCode : generateInviteCode(),
        }
      }, {new : true}
    );
    
    return NextResponse.json(connection);
  } catch (error) {
    console.log("[CONNECTION_ID]", error);
    return new NextResponse("Internal Error", {status : 500});
  }
}