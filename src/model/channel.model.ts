import mongoose, { Schema, Document } from "mongoose";

interface Member extends Document {
  name : string;
  user: mongoose.Schema.Types.ObjectId;
  server: mongoose.Schema.Types.ObjectId;
  type: "text" | "voice" | "video";
}

const MemberSchema : Schema<Member> = new Schema({
  name : {
    type : String,
    required : [true, "Channel name is required..!"]
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  server : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Server",
    required : true
  },
  type : {
    type : String,
    enum : ["text", "voice", "video"],
    default : "text"
  }
}, {timestamps : true});

const MemberModel = mongoose.models.Member || mongoose.model<Member>("Member", MemberSchema);
export default MemberModel;