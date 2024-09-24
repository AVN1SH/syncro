import mongoose, { Schema, Document } from "mongoose";

export interface Server extends Document {
  name : string;
  description ?: string;
  imageUrl : string;
  inviteCode : string;
  isPrivate: boolean;
  user : mongoose.Schema.Types.ObjectId;
  members : mongoose.Schema.Types.ObjectId[];
  channels: mongoose.Schema.Types.ObjectId[];
}

const ServerSchema : Schema<Server> = new Schema({
  name : {
    type : String,
    required : [true, "Server name is required..!"]
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
  channels : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Channel"
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

const ServerModel = mongoose.models.Server || mongoose.model<Server>("Server", ServerSchema); 

export default ServerModel;