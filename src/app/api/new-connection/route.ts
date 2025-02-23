import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import { apiResponse } from "@/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
import MemberModel from "@/model/member.model";
import { DBConnection, DBMember } from "@/types";
import ThreadModel from "@/model/thread.model";

export const generateInviteCode = () : string => {
  const inviteCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return inviteCode;
}

export async function POST(request : Request) {
  try {
    const session = await getServerSession(authOptions);
    if(!session) {
      return apiResponse(401, "Unauthorized");
    }
    
    const body = await request.json();
    const { 
      name, 
      description, 
      profilePhotoUrl,
      bannerPhotoUrl,
    } = body;
    if(name.trim() == '') {
      return apiResponse(400, "Name is required");
    }
    await dbConnect();
    const inviteCode = generateInviteCode();

    //creating new connection in database.
    const connection : DBConnection= await ConnectionModel.create({
      name,
      description : description || '',
      profilePhotoUrl,
      bannerPhotoUrl : bannerPhotoUrl || '',
      inviteCode,
      isPrivate : false,
      user: session.user._id,
      threads : [],
      members : []
    });

    //creating first member as admin
    
    const member : DBMember = await MemberModel.create({
      role : "admin",
      user : session.user._id,
      connection : connection._id
    })

    //adding connection and member to user model.
    await UserModel.findByIdAndUpdate(session.user._id, {
      $push : {
        connections : connection._id,
        members : member._id
      }
    });

    //adding user to connection members.
    await ConnectionModel.findByIdAndUpdate(connection._id, {
      $push : {
        members : member._id
      }
    });

    //creating default text thread.
    const thread = await ThreadModel.create({
      name : "general",
      user : session.user._id,
      connection : connection._id,
      messages : []
    });

    //adding thread to connection.
    await ConnectionModel.findByIdAndUpdate(connection._id, {
      $push : {
        threads : thread._id
      }
    });

    //adding thread to users model.
    await UserModel.findByIdAndUpdate(session.user._id, {
      $push : {
        threads : thread._id
      }
    });

    return apiResponse(200, "Connection created successfully", connection);
  } catch (error) {
    console.log(error);
    return apiResponse(500, "Internal server error");
  }
}