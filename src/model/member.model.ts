import mongoose, {Schema, Document} from "mongoose";

interface Member extends Document {
  role : "admin" | "moderator" | "guest";
  user : mongoose.Schema.Types.ObjectId;
  server : mongoose.Schema.Types.ObjectId;
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
  server : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Server",
    required : true
  },
}, {timestamps : true});

const MemberModel = mongoose.models.Member || mongoose.model<Member>("Member", MemberSchema);

export default MemberModel;