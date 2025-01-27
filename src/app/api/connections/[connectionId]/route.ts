import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import MemberModel from "@/model/member.model";
import ThreadModel from "@/model/thread.model";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { connectionId: string } }
) {
  try {
    const user = await currentUser();
    const { name, profilePhotoUrl } = await req.json();

    if(!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const updatedConnection = await ConnectionModel.findByIdAndUpdate(
      {
        _id : params.connectionId,
        user : user._id,
      }, 
      {
        $set : {
          name,
          profilePhotoUrl
        }
      }, { new : true}
    );

    return NextResponse.json(updatedConnection);

  } catch (error) {
    console.log("connection id patch error : ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { connectionId: string } }
) {
  try {
    const user = await currentUser();

    if(!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await dbConnect();

    const deletedConnection = await ConnectionModel.findByIdAndDelete(
      {
        _id : params.connectionId,
        user : user._id,
      }, 
    );

    if(!deletedConnection) return new NextResponse("Error while deleting connection", { status: 404 });

    //remove it's members and threads

    const deletedMembers = await MemberModel.deleteMany({
      connection : new mongoose.Types.ObjectId(params.connectionId)
    });

    if(!deletedMembers) return new NextResponse("Error while deleting members", { status: 404 });


    const deleteThreads = await ThreadModel.deleteMany({
      connection : new mongoose.Types.ObjectId(params.connectionId)
    })

    if(!deleteThreads) return new NextResponse("Error while deleting Threads", { status: 404 });


    //removing connection from user

    const removeFromUser = await UserModel.findByIdAndUpdate({
      _id : user._id
    }, {
      $Pull : { connections : new mongoose.Types.ObjectId(params.connectionId)}
    });

    if(!removeFromUser) return new NextResponse("Error while removing connection from user", { status : 500 });

    // removing all deleted members and threads from user

    const deleteMemberFromUser = await UserModel.updateMany(
      {
        members : { $in : deletedConnection.members}
      },
      { $pull : { members : {$in : deletedConnection.members}}}
    )

    if(!deleteMemberFromUser) return new NextResponse("Error while removing deleted members from user", { status : 500 })

    const deleteThreadsFromUser = await UserModel.updateMany(
      {
        threads : { $in : deletedConnection.threads}
      },
      { $pull : { threads : {$in : deletedConnection.threads}}}
    )

    if(!deleteThreadsFromUser) return new NextResponse("Error while removing deleted threads from user", { status : 500 })

    return NextResponse.json(deletedConnection);

  } catch (error) {
    console.log("[CONNECTION ID DELETE] : ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}