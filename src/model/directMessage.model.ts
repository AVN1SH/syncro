import mongoose, { Schema, Document } from "mongoose";

export interface DirectMessage extends Document {
  content : string;
  fileUrl : string;
  deleted : boolean;
  member : mongoose.Schema.Types.ObjectId;
  conversation : mongoose.Schema.Types.ObjectId;
}

const DirectMessageSchema : Schema<DirectMessage> = new Schema({
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
  member : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Member",
    required : true,
  },
  conversation : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Conversation",
    required : true
  }
}, {timestamps : true});

const DirectMessageModel = mongoose.models.DirectMessage || mongoose.model<DirectMessage>("DirectMessage", DirectMessageSchema); 

export default DirectMessageModel;