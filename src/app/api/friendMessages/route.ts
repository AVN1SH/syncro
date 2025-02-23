import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import FriendMessageModel from "@/model/friendMessage.model";
import { FriendMessageWithUser } from "@/types";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const MESSAGE_BATCH = 10;

export async function  GET(
  req : Request
) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const friendConversationId = searchParams.get("friendConversationId");

    if(!user) return new NextResponse("Unauthorized", { status: 401 });

    if(!friendConversationId) return new NextResponse("Conversation ID missing", { status: 400 });

    await dbConnect();

    let messages : FriendMessageWithUser[] = [];

    if(cursor) {
      messages = await FriendMessageModel.aggregate([
        {
          $match : {
            _id : { $lt : new mongoose.Types.ObjectId(cursor) },
            friendConversation : new mongoose.Types.ObjectId(friendConversationId)
          }
        }, 
        {
          $lookup : {
            from : "users",
            localField : "user",
            foreignField : "_id",
            as : "user"
          }
        },
        { $unwind : "$user"},
        { $sort : { createdAt : -1 } },
        { $limit : MESSAGE_BATCH + 1 }
      ]).exec();
    } else {
      messages = await FriendMessageModel.aggregate([
        {
          $match : {
            friendConversation : new mongoose.Types.ObjectId(friendConversationId)
          }
        }, 
        {
          $lookup : {
            from : "users",
            localField : "user",
            foreignField : "_id",
            as : "user"
          }
        },
        { $unwind : "$user"},
        { $sort : { createdAt : -1 } },
        { $limit : MESSAGE_BATCH + 1 }
      ]).exec();
    }

    let nextCursor: string | null = null;
    if (messages.length > MESSAGE_BATCH) {
      const nextItem = messages.pop();
      nextCursor = nextItem?._id.toString() || null;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
    
  } catch (error) {
    console.log("[FRIEND MESSAGE GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}