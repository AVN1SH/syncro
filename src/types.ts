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
import { Friend } from "./model/friend.model";
import { FriendConversation } from "./model/friendConversation.model";
import { FriendMessage } from "./model/friendMessage.model";
import { Inbox } from "./model/inbox.model";

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
  createdAt : Date;
  updatedAt : Date;
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

export type DBFriend = Friend &{
  _id : mongoose.Schema.Types.ObjectId;
}

export type DBInbox = Inbox & {
  _id : mongoose.Schema.Types.ObjectId;
}

export type ConnectionThreadMemberUser = DBConnection & {
  threads : DBThread[];
  members : (DBMember & {user : DBUser})[];
}

export type ConnectionThreadMemberUserFriends = DBConnection & {
  threads : DBThread[];
  members : (DBMember & {
    user : DBUser;
    friends : DBFriend[];
  })
}

export type MemberWithUser = DBMember & {
  user : DBUser;
}
export type MemberWithUserWithFriends = DBMember & {
  user : DBUser & {
    friends : DBFriend[];
  }
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

export type FriendConversationsWithUsers = FriendConversation & {
  _id : mongoose.Schema.Types.ObjectId;
  userOne : DBUser;
  userTwo : DBUser;
}

export type DBFriendMessage = FriendMessage & {
  _id : mongoose.Schema.Types.ObjectId;
  createdAt : Date;
  updatedAt : Date;
}

export type FriendMessageWithUser = DBFriendMessage & {
  user : DBUser;
}

// plain object type;
export type PlainUser = User & {
  _id : string;
}

export type PlainFriend = Friend & {
  _id : string;
}

export type PlainFriendWithUser = Friend & {
  _id : string;
  createdAt : Date;
  updatedAt : Date;
  requestingUser : User & {
    _id : string;
  };
  requestedUser : User & {
    _id : string;
  }
}
export type PlainUserWithFriendWithUser = User & {
  _id : string;
  friends : PlainFriendWithUser[]
}

export type PlainUserWithFriendWithUserAndInboxesWithUser = PlainUserWithFriendWithUser & {
  inboxes : PlainInboxWithUser[]
}


export type PlainMember = Member & {
  _id : string;
}

export type PlainMemberWithUser = Member & {
  _id : string;
  user : User & {
    _id : string;
    
  }
}

export type PlainInboxWithUser = Inbox & {
  _id : string;
  sender : PlainUser;
  receiver : PlainUser;
  createdAt : Date;
  updatedAt : Date;
}

//Socket.io

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server : NextServer & {
      io : SocketIOServer
    }
  }
}