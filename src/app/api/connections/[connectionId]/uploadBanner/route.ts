import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(
  req : Request,
  { params } : { params : { connectionId : string } }
) {
  try {

    const { bannerPhotoUrl } = await req.json();
    const user = await currentUser();

    if(!user) return new NextResponse("Unauthorized", { status: 401 });

    if(!bannerPhotoUrl) return new NextResponse("Banner Photo is required", { status: 400 });

    if(!params.connectionId) return new NextResponse("Connection Id is required", { status: 400 });

    await dbConnect();

    const checkingConnection = await ConnectionModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(params.connectionId),

        }
      },
      {
        $lookup : {
          from : "members",
          localField : "members",
          foreignField : "_id",
          as : "members"
        }
      },
      { $unwind : "$members" },
      {
        $match : {
          "members.user" : new mongoose.Types.ObjectId(user._id as string),
          "members.role" : {$in : ["admin", "moderator"]}
        }
      }
    ]).exec();

    if(!checkingConnection) return new NextResponse("Error while checking connection", { status: 400});

    const updatedConnection = await ConnectionModel.findByIdAndUpdate(new mongoose.Types.ObjectId(params.connectionId), {
      $set : {
        bannerPhotoUrl
      }
    });

    return NextResponse.json(updatedConnection);
    
  } catch (error) {
    console.log("[UPLOAD BANNER PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}