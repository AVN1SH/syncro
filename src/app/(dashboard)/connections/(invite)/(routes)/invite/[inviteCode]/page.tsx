import { currentUser } from '@/lib/currentUser';
import dbConnect from '@/lib/dbConnect';
import ConnectionModel from '@/model/connection.model';
import MemberModel from '@/model/member.model';
import UserModel, { User } from '@/model/user.model';
import mongoose, { Types, isValidObjectId } from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

interface InviteCodePageProps {
  params : {
    inviteCode: string;
  }
}

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {

  const user = await currentUser();

  if(!user) {
    return redirect("/sign-in");
  }
  console.log(params.inviteCode)
  if(!params.inviteCode) {
    return redirect("/connections");
  }
  
  await dbConnect();

  // const existingConnection = await ConnectionModel.findOne({
  //   inviteCode: params.inviteCode
  // }).populate({
  //   path : "members",
  //   match : {user : new mongoose.Types.ObjectId(user._id as string)}
  // });

  const existingConnection = await ConnectionModel.aggregate([
    {
      $match: {
        inviteCode: params.inviteCode
      }
    },
    {
      $lookup: {
        from: "members",
        localField: "members",
        foreignField: "_id",
        as: "members"
      }
    },
    {
      $match: {
        "members.user": new mongoose.Types.ObjectId(user._id)
      }
    }
  ]);

  if (existingConnection.length) {
    return redirect(
      `/connections/${existingConnection[0]._id}`);
  }

  const connection = await ConnectionModel.findOne({ inviteCode: params.inviteCode });

  if(!connection) return redirect("/connections")
  
  const newMember = await MemberModel.create({
    user: user._id,
    role: "guest",
    connection: connection._id
  });

  const updatedConnection = await ConnectionModel.findByIdAndUpdate(
    connection._id,
    {
      $push: { members: newMember._id }
    },
    { new: true }
  );
  
  //updating user model.

  await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(user._id), {
    $push : {
      connections : connection._id,
      members : newMember._id
    }
  });

  if(updatedConnection) {
    return redirect(`/connections/${updatedConnection._id}`);
  }

  return null;
}

export default InviteCodePage
