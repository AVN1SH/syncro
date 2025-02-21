import mongoose, {Schema, Document} from "mongoose";
import { User } from "./user.model";
import { Connection } from "./connection.model";
import { deleteMemeberMiddleware } from "@/middleware/deleteMember.middleware";

export interface Friend extends Document {
  status : "accepted" | "pending" | "none";
  requestingUser : mongoose.Schema.Types.ObjectId;
  requestedUser : mongoose.Schema.Types.ObjectId;
}

const FriendSchema : Schema<Friend> = new Schema({
  status : {
    type : String,
    enum : ["accepted", "pending", "none"],
    default : "pending"
  },
  requestingUser : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  requestedUser : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  }
}, {timestamps : true});

const FriendModel = mongoose.models.Friend || mongoose.model<Friend>("Friend", FriendSchema);

export default FriendModel;