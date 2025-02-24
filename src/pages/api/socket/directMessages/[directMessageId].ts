import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import ConversationModel from "@/model/conversation.model";
import DirectMessageModel from "@/model/directMessage.model";
import { DBMember } from "@/types";
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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if(!user) return res.status(401).json({error : "Unauthorized"});

    if(!conversationId) return res.status(400).json({error : "Conversation ID missing"});
    
    await dbConnect();

    const conversation = await ConversationModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(conversationId as string),
        }
      },
      {
        $lookup : {
          from : "members",
          localField : "memberOne",
          foreignField : "_id",
          as : "memberOne"
        }
      },
      { $unwind : "$memberOne" },
      {
        $lookup : {
          from : "members",
          localField : "memberTwo",
          foreignField : "_id",
          as : "memberTwo"
        }
      },
      { $unwind : "$memberTwo" },
      {
        $match : {
          $or : [
            { "memberOne.user" : new mongoose.Types.ObjectId(user._id)},
            { "memberTwo.user" : new mongoose.Types.ObjectId(user._id)}
          ]
        }
      },
    ]);

    if(!conversation.length) return res.status(404).json({message : "Conversation not found"});

    const member : DBMember = String(conversation[0].memberOne.user) === user._id ? conversation[0].memberOne : conversation[0].memberTwo;
    
    if(!member) return res.status(404).json({error : "Member not found"});

    const directMessage = await DirectMessageModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(directMessageId as string),
          conversation : new mongoose.Types.ObjectId(conversationId as string)
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

    if(!directMessage.length || directMessage[0].deleted) {
      return res.status(404).json({error : "DirectMessage not found"});
    }

    const isMessageOwner = String(directMessage[0].member._id) === String(member._id);
    const isAdmin = member.role === "admin";
    const isModerator = member.role === "moderator";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if(!canModify) return res.status(401).json({error : "Unauthorized"});

    if(req.method === "DELETE") {
      directMessage[0] = await DirectMessageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(directMessageId as string), {
        deleted : true,
        fileUrl : null,
        content : "This message has been deleted."
      }, { new : true }).populate({
        path : "member",
        populate : {
          path : "user"
        }
      }).lean()
    }
    
    if(req.method === "PATCH") {
      if(!isMessageOwner) return res.status(401).json({error : "Unauthorized"});

      directMessage[0] = await DirectMessageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(directMessageId as string), {
        content
      }, { new : true }).populate({
        path : "member",
        populate : {
          path : "user"
        }
      }).lean()
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    if (res.socket && 'server' in res.socket) {
      (res.socket as any).server?.io?.emit(updateKey, directMessage[0]);
    }

    return res.status(200).json(directMessage[0]);

  } catch (error) {
    console.log("[DIRECT MESSAGE_ID]", error);
    return res.status(500).json({error : "Internal Error"});
  }
}