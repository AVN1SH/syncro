import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import { serializeData } from "@/lib/serialized";
import ConnectionModel from "@/model/connection.model";
import MemberModel from "@/model/member.model";
import { ConnectionThreadMemberUser } from "@/types";
import mongoose, { isValidObjectId } from "mongoose";
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

        
    console.log({
      "connectionid" : connectionId,
      "membersid" : params.membersId,
      "newrole" : newRole,
      "user" : user._id,
      "typeconnectionid" : typeof(connectionId),
      "typemembersid" : typeof(params.membersId),
      "typenewrole" : typeof(newRole),
      "typeuser" : typeof(user._id),
    })

    console.log(isValidObjectId(new mongoose.Types.ObjectId(params.membersId)));
    console.log(isValidObjectId(connectionId));
    console.log(isValidObjectId(user._id));

    await dbConnect();

    // const con = await ConnectionModel.findOne({
    //   _id : new mongoose.Types.ObjectId(connectionId),
    //   user : new mongoose.Types.ObjectId(user._id as string),
    //   members : {
    //     $elemMatch : {
    //       _id : new mongoose.Types.ObjectId(params.membersId),
    //       // user : {$ne : new mongoose.Types.ObjectId(user._id as string)}
    //     }
    //   }
    // });

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

//deleting connection

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
  