import mongoose from "mongoose";
import { Connection } from "./model/connection.model";
import { Member } from "./model/member.model";
import { User } from "./model/user.model";
import { Thread } from "./model/thread.model";
import { Message } from "./model/message.model";
import { Conversation } from "./model/conversation.model";
import { DirectMessage } from "./model/directMessage.model";

export type SessionUser = {
  _id : string;
  username : string;
  name : string;
  email : string;
  isVerified : boolean;
  imageUrl : string;
}

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
export type DBMessage = Message & {
  _id : mongoose.Schema.Types.ObjectId;
}
export type DBConversation = Conversation & {
  _id : mongoose.Schema.Types.ObjectId;
}
export type DBDirectMessage = DirectMessage & {
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

export type ConversationWithMembersWithUsers = DBConversation & {
  memberOne : DBMember & {
    user : DBUser
  };
  memberTwo : DBMember & {
    user : DBUser;
  };
}
