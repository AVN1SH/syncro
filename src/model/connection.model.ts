import mongoose, { Schema, Document } from "mongoose";

export interface Connection extends Document {
  name : string;
  description ?: string;
  imageUrl : string;
  inviteCode : string;
  isPrivate: boolean;
  user : mongoose.Schema.Types.ObjectId;
  members : mongoose.Schema.Types.ObjectId[];
  threads: mongoose.Schema.Types.ObjectId[];
}

const ConnectionSchema : Schema<Connection> = new Schema({
  name : {
    type : String,
    required : [true, "Connection name is required..!"]
  },
  description : {
    type : String,
  },
  imageUrl : {
    type : String,
  },
  inviteCode : {
    type : String,
    required : true,
    unique : true
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  threads : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Thread"
  }],
  isPrivate : {
    type : Boolean,
    default : false
  },
  members : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Member"
  }]
}, {timestamps : true});

const ConnectionModel = mongoose.models.Connection || mongoose.model<Connection>("Connection", ConnectionSchema); 

export default ConnectionModel;