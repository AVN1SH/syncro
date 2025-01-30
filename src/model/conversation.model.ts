import mongoose, { Schema, Document, Types } from "mongoose";
import { Thread } from "./thread.model";
import { Member } from "./member.model";
import { User } from "./user.model";

export interface Conversation extends Document {
  memberOne : mongoose.Schema.Types.ObjectId;
  memberTwo : mongoose.Schema.Types.ObjectId;
  directMessage : mongoose.Schema.Types.ObjectId;
}

const ConversationSchema : Schema<Conversation> = new Schema({
  memberOne : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Member",
    required : true,
    unique : true
  },
  memberTwo : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Member",
    required : true,
    unique : true
  },
  directMessage : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "DirectMessage",
    required : true
  }
}, {timestamps : true});

const ConversationModel = mongoose.models.Conversation || mongoose.model<Conversation>("Conversation", ConversationSchema); 

export default ConversationModel;