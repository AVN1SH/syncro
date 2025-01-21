import mongoose, { Types } from "mongoose";
import { Connection } from "./model/connection.model";
import { Member } from "./model/member.model";
import { User } from "./model/user.model";
import { Thread } from "./model/thread.model";

export type DBConnection = Connection & {
  _id : mongoose.Schema.Types.ObjectId;
}
export type DBThread = Thread & {
  _id : mongoose.Schema.Types.ObjectId;
}
export type DBMember = Member & {
  _id : mongoose.Schema.Types.ObjectId;
}
export type DBUser = User & {
  _id : mongoose.Schema.Types.ObjectId;
}

export type ConnectionThreadMemberUser = DBConnection & {
  threads : DBThread[];
  members : (DBMember & {user : DBUser})[];
}

export type MemberWithUser = DBMember & {
  user : DBUser;
}

export type ConnectionWithMembersWithUsers = Connection & {
  _id : mongoose.Schema.Types.ObjectId;
  members: (DBMember & {user : DBUser})[];
}
