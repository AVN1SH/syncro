import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import MemberModel from "@/model/member.model";
import MessageModel from "@/model/message.model";
import ThreadModel from "@/model/thread.model";
import { ConnectionWithMembersWithUsers, DBMember, DBThread } from "@/types";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req : NextApiRequest,
  res : NextApiResponse
) {
  if(req.method !== "POST") return res.status(405).json({error : "Method not allowed"});

  try {
    const user = await currentUserPage(req, res);
    const { content, fileUrl } = req.body;
    const { connectionId, threadId } = req.query;

    if(!user) return res.status(401).json({error : "Unauthorized"});

    if(!connectionId) return res.status(400).json({error : "Connection ID is required"});

    if(!threadId) return res.status(400).json({error : "Thread ID is required"});

    if(!content) return res.status(400).json({error : "Content is required"});


    await dbConnect();

    const connection = await ConnectionModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(connectionId as string)
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
      {$unwind : "$members"},
      {
        $match : {
          "members.user" : new mongoose.Types.ObjectId(user._id)
        }
      }
    ]).exec()

    if(!connection.length) return res.status(404).json({error : "Connection not found"});

    const thread : DBThread | null= await ThreadModel.findOne({
      _id : threadId,
      connection : connectionId
    });

    if(!thread) return res.status(404).json({error : "Thread not found"});

    const member : DBMember | null = await MemberModel.findOne({
      user : new mongoose.Types.ObjectId(user._id)
    })

    if(!member) return res.status(404).json({error : "Member not found"});

    const message = await MessageModel.create({
      content,
      fileUrl,
      member : member._id,
      thread : thread._id
    });

    if(!message) return res.status(500).json({error : "Message not created"});

    const updatedThread = await ThreadModel.findByIdAndUpdate(threadId, {
      $push : {
        messages : message._id
      }
    });

    if(!updatedThread) return res.status(500).json({erro : "Thread not updated"});

    const updatedMember = await MemberModel.findByIdAndUpdate(member._id, {
      $push : {
        messages : message._id
      }
    });

    if(!updatedMember) return res.status(500).json({error : "Member not updated"});

    const threadKey = `chat:${threadId}:messages`;

    if (res.socket && 'server' in res.socket) {
      (res.socket as any).server?.io?.emit(threadKey, message);
    }

    return res.status(200).json(message);
  } catch(error) {
    console.log("[MESSAGES POST]", error);
    return res.status(500).json({error : "Internal Server Error"});
  }
}