import mongoose from "mongoose";
import { Connection } from "./model/connection.model";
import { Member } from "./model/member.model";
import { User } from "./model/user.model";
import { Thread } from "./model/thread.model";
import { Message } from "./model/message.model";
import { Conversation } from "./model/conversation.model";
import { DirectMessage } from "./model/directMessage.model";
import { NextApiResponse } from "next";
import { Socket } from "net";
import { NextServer } from "next/dist/server/next";
import { Server as SocketIOServer } from "socket.io";

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
  createdAt : Date;
  updatedAt : Date;
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

export type ConversationWithMembers = DBConversation & {
  memberOne : DBMember,
  memberTwo : DBMember
}

export type ConversationWithMembersWithUsers = DBConversation & {
  memberOne : DBMember & {
    user : DBUser
  };
  memberTwo : DBMember & {
    user : DBUser;
  };
}

export type MessageWithMemberWithUser = DBMessage & {
  member : DBMember & {
    user : DBUser;
  }
}
export type directmessagewithmemberwithUser = DBDirectMessage & {
  member : DBMember & {
    user : DBUser;
  }
}
// plain object type;

export type PlainMember = Member & {
  _id : string;
}

export type PlainMemberWithUser = Member & {
  _id : string;
  user : User & {
    _id : string;
  }
}

//Socket.io

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server : NextServer & {
      io : SocketIOServer
    }
  }
}