import mongoose, { Schema, Document } from "mongoose";

interface Thread extends Document {
  name : string;
  user: mongoose.Schema.Types.ObjectId;
  connection: mongoose.Schema.Types.ObjectId;
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
  }
}, {timestamps : true});

const ThreadModel = mongoose.models.Thread || mongoose.model<Thread>("Thread", ThreadSchema);
export default ThreadModel;