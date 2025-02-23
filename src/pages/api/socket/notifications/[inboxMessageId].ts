import { currentUserPage } from "@/lib/currentUserPages";
import dbConnect from "@/lib/dbConnect";
import InboxModel from "@/model/inbox.model";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req : NextApiRequest,
  res : NextApiResponse
) {
  if(req.method !== "DELETE"){
    return res.status(405).json({error : "Method not allowed"});
  } 

  try {
    const user = await currentUserPage(req, res);
    const { inboxMessageId } = req.body;

    if(!user) return res.status(401).json({error : "Unauthorized"});

    if(!inboxMessageId) return res.status(400).json({error : "inbox message id missing"});
        
    await dbConnect();

    const deletedMessage = await InboxModel.findByIdAndDelete(new mongoose.Types.ObjectId(inboxMessageId as string));

    if(!deletedMessage) return res.status(400).json({error : "Message not found"});

    const deleteInboxKey = `deleteInbox:${user._id}`;

    if (res.socket && 'server' in res.socket) {
      (res.socket as any).server?.io?.emit(deleteInboxKey, inboxMessageId);
    }

    return res.status(200).json(deletedMessage);

  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({error : "Internal Error"});
  }
}