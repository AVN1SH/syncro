import { currentUser } from "@/lib/currentUser";
import InboxModel from "@/model/inbox.model";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const user = await currentUser();
    if(!user) return new NextResponse("Unauthorized", { status : 401 });
  
    const deletedMessage = await InboxModel.deleteMany({
      receiver : new mongoose.Types.ObjectId(user._id)
    });
  
    if(!deletedMessage) return new NextResponse("Message not found", {status : 404});
  
    //removing all InboxMessages form user inboxes
  
    await UserModel.updateMany(
      { _id : new mongoose.Types.ObjectId(user._id) },
      {
        $set : { inboxes : [] }
      }
    )
  
    return NextResponse.json(deletedMessage);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status : 500 });
  }
}