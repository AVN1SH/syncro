import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import DirectMessageModel from "@/model/directMessage.model";
import MessageModel, { Message } from "@/model/message.model";
import { DBDirectMessage } from "@/types";
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
    const conversationId = searchParams.get("conversationId");

    if(!user) return new NextResponse("Unauthorized", { status: 401 });

    if(!conversationId) return new NextResponse("Thread ID missing", { status: 400 });

    await dbConnect();

    let messages : DBDirectMessage[] = [];

    if(cursor) {
      messages = await DirectMessageModel.aggregate([
        {
          $match : {
            _id : { $lt : new mongoose.Types.ObjectId(cursor) },
            thread : new mongoose.Types.ObjectId(conversationId)
          }
        }, 
        {
          $lookup : {
            from : "members",
            localField : "member",
            foreignField : "_id",
            as : "member"
          }
        },
        { $unwind : "$member"},
        {
          $lookup : {
            from : "users",
            localField : "member.user",
            foreignField : "_id",
            as : "member.user"
          }
        },
        { $unwind : "$member.user" },
        { $sort : { createdAt : -1 } },
        { $limit : MESSAGE_BATCH + 1 }
      ]).exec();
    } else {
      messages = await DirectMessageModel.aggregate([
        {
          $match : {
            thread : new mongoose.Types.ObjectId(conversationId)
          }
        }, 
        {
          $lookup : {
            from : "members",
            localField : "member",
            foreignField : "_id",
            as : "member"
          }
        },
        { $unwind : "$member"},
        {
          $lookup : {
            from : "users",
            localField : "member.user",
            foreignField : "_id",
            as : "member.user"
          }
        },
        { $unwind : "$member.user" },
        { $sort : { createdAt : -1 } },
        { $limit : MESSAGE_BATCH + 1 }
      ]).exec();
    }

    let nextCursor: string | null = null;
    if (messages.length > MESSAGE_BATCH) {
      const nextItem = messages.pop();
      nextCursor = nextItem?._id.toString() || null;
    }

    // if(messages.length === MESSAGE_BATCH) {
    //   nextCursor = messages[MESSAGE_BATCH - 1]._id.toString();
    // }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
    
  } catch (error) {
    console.log("[DIRECT MESSAGE GET", error);
    return new Response("Internal Error", { status: 500 });
  }
}