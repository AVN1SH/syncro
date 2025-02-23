import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content : string;
  fileUrl : string;
  deleted : boolean;
  member : mongoose.Schema.Types.ObjectId;
  thread : mongoose.Schema.Types.ObjectId;
}

const MessageSchema : Schema<Message> = new Schema({
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
  thread : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Thread",
    required : true
  },
  member : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Member",
    required : true
  }
}, {timestamps : true});

const MessageModel = mongoose.models.Message || mongoose.model<Message>("Message", MessageSchema); 

export default MessageModel;