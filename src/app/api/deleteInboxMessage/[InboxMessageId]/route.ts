import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import InboxModel from "@/model/inbox.model";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req : Request) {
  try {
    const user = await currentUser();
    const { inboxMessageId } = await req.json();

    if(!user) return new NextResponse("Unauthorized", { status : 401 });

    if(!inboxMessageId) return new NextResponse("inbox message id missing", {status : 400});
        
    await dbConnect();

    const deletedMessage = await InboxModel.findByIdAndDelete(new mongoose.Types.ObjectId(inboxMessageId as string));

    if(!deletedMessage) return new NextResponse("Message not found", {status : 404});

    // updating user model..

    await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id));

    return NextResponse.json(deletedMessage);

  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return new NextResponse("Internal Error", {status : 500});
  }
}