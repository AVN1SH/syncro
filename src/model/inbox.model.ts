import mongoose, { Schema, Document, Types } from "mongoose";

export interface Inbox extends Document {
  title : string;
  type : string;
  content : string;
  markAsRead : boolean;
  sender : mongoose.Schema.Types.ObjectId;
  receiver : mongoose.Schema.Types.ObjectId;
}

const InboxSchema : Schema<Inbox> = new Schema({
  title : {
    type : String,
    required : true,
  },
  type : {
    type : String,
    required : true,
  },
  content : {
    type : String,
    required : true,
  },
  markAsRead : {
    type : Boolean,
    default : false
  },
  sender : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true,
  },
  receiver : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  }
}, {timestamps : true});

const InboxModel = mongoose.models.Inbox || mongoose.model<Inbox>("Inbox", InboxSchema); 

export default InboxModel;