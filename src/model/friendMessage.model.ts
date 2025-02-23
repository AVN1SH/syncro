import mongoose, { Schema, Document } from "mongoose";

export interface FriendMessage extends Document {
  content : string;
  fileUrl : string;
  deleted : boolean;
  user : mongoose.Schema.Types.ObjectId;
  friendConversation : mongoose.Schema.Types.ObjectId;
}

const FriendMessageSchema : Schema<FriendMessage> = new Schema({
  content : {
    type : String,
  },
  fileUrl : {
    type : String,
  },
  deleted : {
    type : Boolean,
    default : false
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true,
  },
  friendConversation : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "FriendConversation",
    required : true
  }
}, {timestamps : true});

const FriendMessageModel = mongoose.models.FriendMessage || mongoose.model<FriendMessage>("FriendMessage", FriendMessageSchema); 

export default FriendMessageModel;