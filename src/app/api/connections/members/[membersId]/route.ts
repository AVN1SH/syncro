import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import { serializeData } from "@/lib/serialized";
import ConnectionModel from "@/model/connection.model";
import MemberModel from "@/model/member.model";
import UserModel from "@/model/user.model";
import { ConnectionThreadMemberUser } from "@/types";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { membersId: string } }
) {
  try {
    const user = await currentUser();
    
    const { searchParams } = new URL(req.url);
    const { newRole } = await req.json();
    
    const connectionId = searchParams.get("connectionId");
    
    if(!user) return new NextResponse("Unauthorized", { status: 401 });
    
    if(!connectionId) return new NextResponse("Connection Id Missing", { status: 400 });
    
    if(!params.membersId) return new NextResponse("Member Id Missing", { status: 400 });

    await dbConnect();

    const checkingConnection = await ConnectionModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(connectionId),
          user : new mongoose.Types.ObjectId(user._id as string)
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
          "members._id" : new mongoose.Types.ObjectId(params.membersId),
          "members.user" : {$ne : new mongoose.Types.ObjectId(user._id as string)}
        }
      }
    ])

    if(!checkingConnection.length) return new NextResponse("Connection Matched failed", {status : 500});

    const updatedConnection = await MemberModel.findByIdAndUpdate(params.membersId, {
      $set : {
        role : newRole
      }
    })

    if(!updatedConnection) return new NextResponse("Error while updating connection", {status : 500});

    const connection : ConnectionThreadMemberUser | null = serializeData(await ConnectionModel.findById(new mongoose.Types.ObjectId(connectionId))
    .populate({
      path : "members",
      options : {sort : {role : "asc"}},
      populate: {
        path: "user",
        select: "name email imageUrl",
      }
    }).lean() as ConnectionThreadMemberUser | null);

    return NextResponse.json(connection?.members);
  } catch (error) {
    console.log("Members Id Patch error : ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }

}

//deleting member

export async function DELETE(
  req : Request,
  { params } : { params : { membersId : string } }
) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const connectionId = searchParams.get("connectionId");

    if(!user) return new NextResponse("Unauthorized", { status: 401 });

    if(!connectionId) return new NextResponse("Connection Id Missing", { status: 400 });

    if(!params.membersId) return new NextResponse("Member Id Missing", { status: 400 });

    await dbConnect();

    const checkingConnection = await ConnectionModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(connectionId),
          user : new mongoose.Types.ObjectId(user._id as string)
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
          "members._id" : new mongoose.Types.ObjectId(params.membersId),
          "members.user" : {$ne : new mongoose.Types.ObjectId(user._id as string)}
        }
      }
    ])

    if(!checkingConnection.length) return new NextResponse("Connection Matched failed", {status : 500});

    const deleteMember = await MemberModel.findByIdAndDelete(params.membersId);

    const updatedConnection = await ConnectionModel.findByIdAndUpdate(connectionId, {
      $pull : {
        members : new mongoose.Types.ObjectId(params.membersId)
      }
    })

    if(!updatedConnection) return new NextResponse("Error while updating connection", {status : 500});


    if(!deleteMember) return new NextResponse("Error while updating connection", {status : 500});

    //removing member from user

    const updatedUser = await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
      $pull : {
        members : deleteMember._id
      }
    });

    if(!updatedUser) return new NextResponse("Error while updating user", {status : 500});

    const connection : ConnectionThreadMemberUser | null = serializeData(await ConnectionModel.findById(new mongoose.Types.ObjectId(connectionId))
    .populate({
      path : "members",
      options : {sort : {role : "asc"}},
      populate: {
        path: "user",
        select: "name email imageUrl",
      }
    }).lean() as ConnectionThreadMemberUser | null);

    return NextResponse.json(connection?.members);
    
  } catch (error) {
    console.log("Members Id Delete error : ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}