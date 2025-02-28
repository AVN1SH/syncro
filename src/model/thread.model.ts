import mongoose, { Schema, Document } from "mongoose";

export interface Thread extends Document {
  name : string;
  user: mongoose.Schema.Types.ObjectId;
  connection: mongoose.Schema.Types.ObjectId;
  messages : mongoose.Schema.Types.ObjectId[];
  type: "text" | "voice" | "video";
}

const ThreadSchema : Schema<Thread> = new Schema({
  name : {
    type : String,
    required : [true, "Thread name is required..!"]
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  connection : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Connection",
    required : true
  },
  type : {
    type : String,
    enum : ["text", "voice", "video"],
    default : "text"
  },
  messages : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Message"
  }]
}, {timestamps : true});

const ThreadModel = mongoose.models.Thread || mongoose.model<Thread>("Thread", ThreadSchema);
export default ThreadModel;