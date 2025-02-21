import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import FriendConversationModel from "@/model/friendConversation.model";
import FriendMessageModel from "@/model/friendMessage.model";
import UserModel from "@/model/user.model";
import { DBFriendMessage, DBUser, FriendConversationsWithUsers, FriendMessageWithUser } from "@/types";
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
    const { friendConversationId } = req.query;

    if(!user) return res.status(401).json({error : "Unauthorized"});

    if(!friendConversationId) return res.status(400).json({error : "Friend Conversation ID is required"});

    if(!content) return res.status(400).json({error : "Content is required"});

    await dbConnect();

    const conversation : FriendConversationsWithUsers[] = await FriendConversationModel.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(friendConversationId as string),
        }
      },
      {
        $lookup : {
          from : "users",
          localField : "userOne",
          foreignField : "_id",
          as : "userOne"
        }
      },
      { $unwind : "$userOne" },
      {
        $lookup : {
          from : "users",
          localField : "userTwo",
          foreignField : "_id",
          as : "userTwo"
        }
      },
      { $unwind : "$userTwo" },
      {
        $match : {
          $or : [
            { "userOne._id" : new mongoose.Types.ObjectId(user._id)},
            { "userTwo._id" : new mongoose.Types.ObjectId(user._id)}
          ]
        }
      },
    ]);

    if(!conversation.length) return res.status(404).json({message : "Conversation not found"});

    const userData : DBUser = String(conversation[0].userOne._id) === user._id ? conversation[0].userOne : conversation[0].userTwo;

    if(!userData) return res.status(404).json({error : "User not found"});

    const message : DBFriendMessage = await FriendMessageModel.create({
      content,
      fileUrl,
      friendConversation : new mongoose.Types.ObjectId(friendConversationId as string),
      user : userData._id
    });


    if(!message) return res.status(500).json({error : "Message not created"});

    const updatedMessage : FriendMessageWithUser[] = await FriendMessageModel.aggregate([
      {
        $match : {
          _id : message._id
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
      { $unwind : "$user" },
    ])

    if(!updatedMessage.length) return res.status(500).json({error : "Message with user not found."})

    const updateConversation = await FriendConversationModel.findByIdAndUpdate(friendConversationId, {
      $push : {
        friendMessages : message._id
      }
    });

    if(!updateConversation) return res.status(500).json({erro : "Friend Conversation not updated"});

    const updatedUser = await UserModel.findByIdAndUpdate(userData._id, {
      $push : {
        friendMessages : message._id
      }
    });

    if(!updatedUser) return res.status(500).json({error : "Member not updated"});

    const threadKey = `chat:${friendConversationId}:messages`;

    if (res.socket && 'server' in res.socket) {
      (res.socket as any).server?.io?.emit(threadKey, updatedMessage[0]);
    }

    return res.status(200).json(updatedMessage[0]);
  } catch(error) {
    console.log("[FRIEND MESSAGES POST]", error);
    return res.status(500).json({error : "Internal Server Error"});
  }
}