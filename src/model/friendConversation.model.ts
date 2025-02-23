import mongoose, { Schema, Document } from "mongoose";

export interface FriendConversation extends Document {
  userOne : mongoose.Schema.Types.ObjectId;
  userTwo : mongoose.Schema.Types.ObjectId;
  friendMessages : mongoose.Schema.Types.ObjectId[];
}

const FriendConversationSchema : Schema<FriendConversation> = new Schema({
  userOne : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  userTwo : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
  friendMessages : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "FriendMessage",
  }]
}, {timestamps : true});
FriendConversationSchema.index({ userOne: 1, userTwo: 1 }, { unique: true });

const FriendConversationModel = mongoose.models.FriendConversation || mongoose.model<FriendConversation>("FriendConversation", FriendConversationSchema); 

export default FriendConversationModel;