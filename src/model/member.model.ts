import mongoose, {Schema, Document} from "mongoose";

export interface Member extends Document {
  role : "admin" | "moderator" | "guest";
  user : mongoose.Schema.Types.ObjectId;
  connection : mongoose.Schema.Types.ObjectId;
  messages : mongoose.Schema.Types.ObjectId[];
  conversationsInitiated : mongoose.Schema.Types.ObjectId[];
  conversationsReceived : mongoose.Schema.Types.ObjectId[];
  directMessages : mongoose.Schema.Types.ObjectId[];
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
  messages : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Message"
  }],
  conversationsInitiated : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Conversation"
  }],
  conversationsReceived : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Conversation"
  }],
  directMessages : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "DirectMessage"
  }]
}, {timestamps : true});

const MemberModel = mongoose.models.Member || mongoose.model<Member>("Member", MemberSchema);

export default MemberModel;