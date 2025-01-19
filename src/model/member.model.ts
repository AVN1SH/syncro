import mongoose, {Schema, Document} from "mongoose";
import { User } from "./user.model";
import { Connection } from "./connection.model";

export interface Member extends Document {
  role : "admin" | "moderator" | "guest";
  user : User;
  connection : Connection;
}

const MemberSchema : Schema<Member> = new Schema({
  role : {
    type : String,
    enum : ["admin", "moderator", "guest"],
    default : "guest"
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
}, {timestamps : true});

const MemberModel = mongoose.models.Member || mongoose.model<Member>("Member", MemberSchema);

export default MemberModel;