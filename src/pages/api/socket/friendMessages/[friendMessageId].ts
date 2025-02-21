import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import ConnectionModel from "@/model/connection.model";
import ConversationModel from "@/model/conversation.model";
import DirectMessageModel from "@/model/directMessage.model";
import FriendConversationModel from "@/model/friendConversation.model";
import FriendMessageModel from "@/model/friendMessage.model";
import MemberModel from "@/model/member.model";
import MessageModel from "@/model/message.model";
import ThreadModel from "@/model/thread.model";
import { ConnectionWithMembersWithUsers, DBMember, DBThread, DBUser } from "@/types";
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
    const { friendMessageId, friendConversationId } = req.query;
    const { content } = req.body;

    if(!user) return res.status(401).json({error : "Unauthorized"});

    if(!friendConversationId) return res.status(400).json({error : "Friend Conversation ID missing"});
    
    await dbConnect();

    const conversation = await FriendConversationModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(friendConversationId as string),
        }
      },
      {
        $match : {
          $or : [
            { "userOne" : new mongoose.Types.ObjectId(user._id)},
            { "userTwo" : new mongoose.Types.ObjectId(user._id)}
          ]
        }
      },
    ]);

    if(!conversation.length) return res.status(404).json({message : "Friend Conversation not found"});

    const userData : DBUser = String(conversation[0].userOne) === user._id ? conversation[0].userOne : conversation[0].userTwo;
    
    if(!userData) return res.status(404).json({error : "User not found"});

    let friendMessage = await FriendMessageModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(friendMessageId as string),
          friendConversation : new mongoose.Types.ObjectId(friendConversationId as string)
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
    ]).exec();

    if(!friendMessage.length || friendMessage[0].deleted) {
      return res.status(404).json({error : "Friend Message not found"});
    }

    const isMessageOwner = String(friendMessage[0].user._id) === user._id;
    const canModify = isMessageOwner;

    if(!canModify) return res.status(401).json({error : "Unauthorized"});

    if(req.method === "DELETE") {
      friendMessage[0] = await FriendMessageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(friendMessageId as string), {
        deleted : true,
        fileUrl : null,
        content : "This message has been deleted."
      }, { new : true }).populate("user").lean()
    }
    
    if(req.method === "PATCH") {
      if(!isMessageOwner) return res.status(401).json({error : "Unauthorized"});

      friendMessage[0] = await FriendMessageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(friendMessageId as string), {
        content
      }, { new : true }).populate("user").lean()
    }

    const updateKey = `chat:${friendConversationId}:messages:update`;

    if (res.socket && 'server' in res.socket) {
      (res.socket as any).server?.io?.emit(updateKey, friendMessage[0]);
    }

    return res.status(200).json(friendMessage[0]);

  } catch (error) {
    console.log("[FRIEND MESSAGE_ID]", error);
    return res.status(500).json({error : "Internal Error"});
  }
}