import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import MemberModel from "@/model/member.model";
import ThreadModel from "@/model/thread.model";
import { DBUser } from "@/types";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const user : DBUser = await currentUser();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    
    const connectionId = searchParams.get("connectionId");
    
    if(!user) return new NextResponse("Unauthorized", { status: 401 });
    
    if(!connectionId) return new NextResponse("Connection ID missing", { status: 400 });

    if(name === "general") return new NextResponse("Name cannot be 'general'", { status: 400 });

    await dbConnect();


    const checkingConnection = await ConnectionModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(connectionId)
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
      {
        $unwind : "$members"
      },
      {
        $match : {
          "members.user" : {$ne : user._id},
          "members.role" : {$in : ["admin", "moderator"]}
        }
      }
    ])

    if(!checkingConnection.length) return new NextResponse("Connection Matched Failed", {status : 500});

    const createThread = await ThreadModel.create({
      name,
      type,
      user : user._id,
      connection :new mongoose.Types.ObjectId(connectionId)
    }, {new : true})

    if(!createThread) return new NextResponse("Thread Creation Failed", {status : 500});

    return NextResponse.json(createThread);

  } catch (error) {
    console.log("[THREAD_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}