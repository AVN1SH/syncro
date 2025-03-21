import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import MemberModel from "@/model/member.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params } : { params : { connectionId : string}}
) {
  try {
    const user = await currentUser();

    if(!user) return new NextResponse("Unauthorized", { status: 401 });

    if(!params.connectionId) return new NextResponse("Connection ID Missing", { status: 400 });

    await dbConnect();

    const checkConnection = await ConnectionModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(params.connectionId),
          user : {$ne : new mongoose.Types.ObjectId(user._id)}
        }
      }
    ])

    if(!checkConnection.length) return new NextResponse("You may have admin of this connection", { status : 400});

    const deleteMember = await MemberModel.findOneAndDelete({
      user : new mongoose.Types.ObjectId(user._id),
      connection : new mongoose.Types.ObjectId(params.connectionId)
    });

    if(!deleteMember) return new NextResponse("Member Not Found", { status: 404 });

    const updatedConnection = await ConnectionModel.findByIdAndUpdate(params.connectionId, {
      $pull : {
        members : deleteMember._id
      }
    })

    if(!updatedConnection) return new NextResponse("Error while updating connection", {status : 500});

    return NextResponse.json(deleteMember);

  } catch (error) {
    console.log("[CONNECTION_LEAVE]", error);
    return new Response("Internal Error", { status: 500 });
  }
}