import { currentUser } from "@/lib/currentUser";
import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import MemberModel from "@/model/member.model";
import MessageModel from "@/model/message.model";
import ThreadModel from "@/model/thread.model";
import { ConnectionWithMembersWithUsers, DBMember, DBThread, MemberWithUser, MessageWithMemberWithUser } from "@/types";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req : NextApiRequest,
  res : NextApiResponse
) {
  if(req.method !== "DELETE" && req.method !== "PATCH"){
    return res.status(405).json({error : "Method not allowed"});
  } 

  try {
    const user = await currentUserPage(req, res);
    const { messageId, connectionId, threadId } = req.query;
    const { content } = req.body;

    if(!user) return res.status(401).json({error : "Unauthorized"});

    if(!messageId) return res.status(400).json({error : "Message ID missing"});
    
    if(!connectionId) return res.status(400).json({error : "Connection ID missing"});
    
    if(!threadId) return res.status(400).json({error : "Thread ID missing"});
    
    if(!content) return res.status(400).json({error : "Content missing"});
    
    console.log("connection", user, messageId, connectionId, threadId, content);
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
    ]).exec();
    
    if(!connection.length) return res.status(404).json({error : "Connection not found"});
    
    const thread : DBThread[] = await ThreadModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(threadId as string),
          connection : new mongoose.Types.ObjectId(connectionId as string)
        }
      }
    ]).exec();
    
    if(!thread.length) return res.status(404).json({error : "Thread not found"});
    
    const member = connection[0].members.find((member : DBMember) => String(member.user) === user._id)

    if(!member) return res.status(404).json({error : "Member not found"});

    let message = await MessageModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(messageId as string),
          thread : new mongoose.Types.ObjectId(threadId as string)
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
    ]).exec();

    if(!message.length || message[0].deleted) {
      return res.status(404).json({error : "Message not found"});
    }

    const isMessageOwner = String(message[0].member._id) === String(member._id);
    const isAdmin = member.role === "admin";
    const isModerator = member.role === "moderator";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if(!canModify) return res.status(401).json({error : "Unauthorized"});

    if(req.method === "DELETE") {
      message[0] = await MessageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(messageId as string), {
        deleted : true,
        fileUrl : null,
        content : "This message has been deleted."
      }, { new : true }).populate({
        path : "member",
        populate : {
          path : "user"
        }
      }).lean()

      const updatedMember = await MemberModel.findByIdAndUpdate(member._id, {
        $pull : {
          messages : new mongoose.Types.ObjectId(messageId as string)
        }
      });

      if(!updatedMember) return res.status(500).json({error : "Error while updating member"});

      const updatedThread = await ThreadModel.findByIdAndUpdate(new mongoose.Types.ObjectId(threadId as string), {
        $pull : {
          messages : new mongoose.Types.ObjectId(messageId as string)
        }
      });

      if(!updatedThread) return res.status(500).json({error : "Error while updating thread"});
    }
    
    if(req.method === "PATCH") {
      if(!isMessageOwner) return res.status(401).json({error : "Unauthorized"});

      message[0] = await MessageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(messageId as string), {
        content
      }, { new : true }).populate({
        path : "member",
        populate : {
          path : "user"
        }
      }).lean()
    }

    const updateKey = `chat:${threadId}:messages:update`;

    if (res.socket && 'server' in res.socket) {
      (res.socket as any).server?.io?.emit(updateKey, message);
    }

    return res.status(200).json(message[0]);

  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({error : "Internal Error"});
  }
}