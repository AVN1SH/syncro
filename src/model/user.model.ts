import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  imageUrl: string;
  role: string;
  isVerified : boolean;
  connections : mongoose.Schema.Types.ObjectId[];
  members : mongoose.Schema.Types.ObjectId[];
  threads : mongoose.Schema.Types.ObjectId[];
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
    required: [true, "Password is required..!"],
  },
  imageUrl: {
    type : String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
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
  }]
}, {timestamps : true});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);

export default UserModel;