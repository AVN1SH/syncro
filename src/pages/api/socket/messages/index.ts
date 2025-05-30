import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import MemberModel from "@/model/member.model";
import MessageModel from "@/model/message.model";
import ThreadModel from "@/model/thread.model";
import { ConnectionWithMembersWithUsers, DBMember, DBMessage, DBThread, MessageWithMemberWithUser } from "@/types";
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

    const connection : ConnectionWithMembersWithUsers[] = await ConnectionModel.aggregate([
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
      {
        $addFields: {
          members: {
            $filter: {
              input: "$members",
              as: "member",
              cond: { $eq: ["$$member.user", new mongoose.Types.ObjectId(user._id)] }
            }
          }
        }
      }
    ]).exec()

    if(!connection.length) return res.status(404).json({error : "Connection not found"});

    const thread : DBThread | null= await ThreadModel.findOne({
      _id : threadId,
      connection : connectionId
    });

    if(!thread) return res.status(404).json({error : "Thread not found"});

    const member = connection[0].members.find((member : DBMember) => String(member.user) === user._id)

    if(!member) return res.status(404).json({error : "Member not found"});

    const message : DBMessage = await MessageModel.create({
      content,
      fileUrl,
      member : member._id,
      thread : thread._id
    });


    if(!message) return res.status(500).json({error : "Message not created"});

    const updatedMessage : MessageWithMemberWithUser[] = await MessageModel.aggregate([
      {
        $match : {
          _id : message._id
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
      { $unwind : "$member" },
      {
        $lookup : {
          from : "users",
          localField : "member.user",
          foreignField : "_id",
          as : "member.user"
        }
      },
      { $unwind : "$member.user" }
    ])

    if(!updatedMessage) return res.status(500).json({error : "Message with member and user not found."})

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
      (res.socket as any).server?.io?.emit(threadKey, updatedMessage[0]);
    }

    return res.status(200).json(updatedMessage[0]);
  } catch(error) {
    console.log("[MESSAGES POST]", error);
    return res.status(500).json({error : "Internal Server Error"});
  }
}