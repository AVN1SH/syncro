import mongoose from "mongoose";

export interface ConnectionType extends Document {
  _id : mongoose.Schema.Types.ObjectId;
  name : string;
  description ?: string;
  profilePhotoUrl : string;
  bannerPhotoUrl : string;
  inviteCode : string;
  isPrivate: boolean;
  user : mongoose.Schema.Types.ObjectId;
  members : mongoose.Schema.Types.ObjectId[];
  threads: mongoose.Schema.Types.ObjectId[];
}