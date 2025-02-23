import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import { serializeData } from "@/lib/serialized";
import InboxModel from "@/model/inbox.model";
import UserModel from "@/model/user.model";
import { PlainInboxWithUser } from "@/types";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req : NextApiRequest,
  res : NextApiResponse
) {
  if(req.method !== "POST") return res.status(405).json({error : "Method not allowed"});

  try {
    const user = await currentUserPage(req, res);
    
    if(!user) return res.status(401).json({error : "Unauthorized"});
    
    await dbConnect();
    
    if(req.method === "POST") {
      const { title , type, content, friendUserId } = await req.body;

      if(!title || !type || !content || !friendUserId) return res.status(400).json({error : "Missing Fields"});

      const newMessage = await InboxModel.create({
        title,
        type,
        content,
        sender : new mongoose.Types.ObjectId(user._id),
        receiver : new mongoose.Types.ObjectId(friendUserId as string),
      }).then(doc => doc.populate("sender")).then(doc => doc.toObject({ getters: true, virtuals: true }));
      
      if(!newMessage) return res.status(500).json({error : "Error while sending inbox message"});
      
      const plainMessage : PlainInboxWithUser = serializeData(newMessage);
  
      // updaing user models
  
      await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(friendUserId as string), {
        $push : {
          inboxes : newMessage._id
        }
      })
  
      if(type !== "system") {
        if(res.socket && "server" in res.socket) {
          (res.socket as any).server?.io?.emit(`inbox:${friendUserId}`, plainMessage);
        }
      }
  
      return res.status(200).json(plainMessage);
    }
  } catch(error) {
    console.log("[INBOX MESSAGES POST]", error);
    return res.status(500).json({error : "Internal Server Error"});
  }
}