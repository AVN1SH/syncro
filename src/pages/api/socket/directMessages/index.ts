import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import ConversationModel from "@/model/conversation.model";
import DirectMessageModel from "@/model/directMessage.model";
import MemberModel from "@/model/member.model";
import { ConversationWithMembers, DBDirectMessage, DBMember, MessageWithMemberWithUser } from "@/types";
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
    const { conversationId } = req.query;

    if(!user) return res.status(401).json({error : "Unauthorized"});

    if(!conversationId) return res.status(400).json({error : "Conversation ID is required"});

    if(!content) return res.status(400).json({error : "Content is required"});


    await dbConnect();

    const conversation : ConversationWithMembers[] = await ConversationModel.aggregate([
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

    const message : DBDirectMessage = await DirectMessageModel.create({
      content,
      fileUrl,
      conversation : new mongoose.Types.ObjectId(conversationId as string),
      member : member._id
    });


    if(!message) return res.status(500).json({error : "Message not created"});

    const updatedMessage : MessageWithMemberWithUser[] = await DirectMessageModel.aggregate([
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
      { $unwind : "$member.user" },
    ])

    if(!updatedMessage.length) return res.status(500).json({error : "Message with member and user not found."})

    const updateConversation = await ConversationModel.findByIdAndUpdate(conversationId, {
      $push : {
        directMessages : message._id
      }
    });

    if(!updateConversation) return res.status(500).json({erro : "Conversation not updated"});

    const updatedMember = await MemberModel.findByIdAndUpdate(member._id, {
      $push : {
        directMessages : message._id
      }
    });

    if(!updatedMember) return res.status(500).json({error : "Member not updated"});

    const threadKey = `chat:${conversationId}:messages`;

    if (res.socket && 'server' in res.socket) {
      (res.socket as any).server?.io?.emit(threadKey, updatedMessage[0]);
    }

    return res.status(200).json(updatedMessage[0]);
  } catch(error) {
    console.log("[DIRECT MESSAGES POST]", error);
    return res.status(500).json({error : "Internal Server Error"});
  }
}