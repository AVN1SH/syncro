import mongoose, { Schema, Document } from "mongoose";
import { Connection } from "./connection.model";
import { Member } from "./member.model";
import { Thread } from "./thread.model";

export interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  imageUrl: string;
  type: "emailPass" | "google";
  isVerified : boolean;
  connections : mongoose.Schema.Types.ObjectId[];
  members : mongoose.Schema.Types.ObjectId[];
  threads : mongoose.Schema.Types.ObjectId[];
  friends : mongoose.Schema.Types.ObjectId[];
  friendMessages : mongoose.Schema.Types.ObjectId[];
  inboxes : mongoose.Schema.Types.ObjectId[];
}

const UserSchema : Schema<User> = new Schema({
  name: {
    type: String,
    required: [true, "Name is required..!"],
  },
  username: {
    type: String,
    required: [true, "Username is required..!"],
    unique: true,
    match : [/^[a-zA-Z0-9_-]+$/, "Username must only contain letters, numbers, underscore and hyphen"]
  },
  email: {
    type: String,
    required: [true, "Email is required..!"],
    unique: true,
    match : [/.+\@.+\..+/, "Please use a valid email address"]
  },
  password: {
    type: String,
  },
  imageUrl: {
    type : String,
  },
  type: {
    type: String,
    enum : ["emailPass", "google"],
  },
  isVerified : {
    type : Boolean,
    default : false
  },
  connections : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Connections"
  }],
  members : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Member"
  }],
  threads : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Thread"
  }],
  friends : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Friend"
  }],
  friendMessages : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "FriendMessage"
  }],
  inboxes : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Inbox"
  }]
}, {timestamps : true});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);

export default UserModel;