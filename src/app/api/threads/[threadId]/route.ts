import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import ThreadModel from "@/model/thread.model";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params } : { params : { threadId : string }}
) {
  try {

    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const connectionId = searchParams.get("connectionId");

    if(!user) return new NextResponse("Unauthorized", { status : 401 });

    if(!connectionId) return new NextResponse("Thread ID Missing", { status : 400 });

    if(!params.threadId) return new NextResponse("Thread ID Missing", { status : 400 });

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
      { $unwind : "$members"},
      {
        $match : {
          "members.user" : new mongoose.Types.ObjectId(user._id),
          "members.role" : {$in : ["admin", "moderator"]}
        }
      }
    ]).exec();

    if(!checkingConnection.length) return new NextResponse("No record Found", { status : 500 });

    const deletedThread = await ThreadModel.deleteOne({
      _id : new mongoose.Types.ObjectId(params.threadId),
      name : {$ne : "general"}
    });

    if(!deletedThread) return new NextResponse("Error while deleting Thread", { status : 500 });

    // removing thread from connection and user

    const removeThreadFromConnection = await ConnectionModel.findByIdAndUpdate(connectionId, {
      $pull : {
        threads : new mongoose.Types.ObjectId(params.threadId)
      }
    })

    if(!removeThreadFromConnection) return new NextResponse("Error while removing thread from connection", { status : 500 });

    const removeThreadFromUser = await UserModel.findByIdAndUpdate(user._id, {
      $pull : {
        threads : new mongoose.Types.ObjectId(params.threadId)
      }
    })

    if(!removeThreadFromUser) return new NextResponse("Error while removing thread from user", { status : 500 });

    return NextResponse.json(deletedThread);
    
  } catch (error) {
    console.log("CHANNELID DELETE", error);
    return new NextResponse("Internal Error", { status : 500 });
  }
}

export async function PATCH(
  req: Request,
  { params } : { params : { threadId : string }}
) {
  try {

    const user = await currentUser();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const connectionId = searchParams.get("connectionId");

    if(!user) return new NextResponse("Unauthorized", { status : 401 });

    if(!connectionId) return new NextResponse("Thread ID Missing", { status : 400 });

    if(!params.threadId) return new NextResponse("Thread ID Missing", { status : 400 });

    if(name === "general") return new NextResponse("Name can't be 'general'", { status : 400 });

    await dbConnect();

    const checkingConnection = await ConnectionModel.aggregate([
      {
        $match : {
          _id: new mongoose.Types.ObjectId(connectionId)
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
      { $unwind : "$members"},
      {
        $match : {
          "members.user" : new mongoose.Types.ObjectId(user._id),
          "members.role" : {$in : ["admin", "moderator"]}
        }
      }
    ]).exec();

    if(!checkingConnection.length) return new NextResponse("No record Found", { status : 500 });

    const updatedThread = await ThreadModel.updateOne({
      _id : new mongoose.Types.ObjectId(params.threadId),
      name : {$ne : "general"}
    },{
      $set : {
        name,
        type
      }
    });

    if(!updatedThread) return new NextResponse("Error while updating Thread", { status : 500 });

    return NextResponse.json(updatedThread);
    
  } catch (error) {
    console.log("CHANNEL ID PATCH", error);
    return new NextResponse("Internal Error", { status : 500 });
  }
}