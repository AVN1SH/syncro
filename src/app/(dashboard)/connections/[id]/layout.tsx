import Primary from '@/components/windows/Primary'
import { currentUser } from '@/lib/currentUser'
import dbConnect from '@/lib/dbConnect';
import ConnectionModel from '@/model/connection.model';
import { User } from '@/model/user.model';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({children, params} : {children : React.ReactNode; params : {id : string}}) => {

  console.log("params : ", params)
  await dbConnect();
  
  const user : User = await currentUser();

  if(!user) {
    return redirect("/sign-in");
  }

  // const connection = await ConnectionModel.find({
  //   _id : new mongoose.Types.ObjectId(params.id as string)
  // })
  // .populate({
  //   path : "members",
  //   match : {user : new mongoose.Types.ObjectId(user._id as string)}
  // });

  const connection = await ConnectionModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(params.id as string)
      },
    },
    {
      $lookup: {
        from: "members",
        localField: "members", 
        foreignField: "_id", 
        as: "members",
      },
    },
    {
      $match: {
        "members.user": new mongoose.Types.ObjectId(user._id as string),
      },
    },
  ])

  console.log("connection", connection);
  console.log("user : " , user._id)

  if(!connection.length) {
    return redirect("/connections");
  }


  return (
    <div className="flex h-full w-[250px] z-30 flex-col fixed inset-y-0 top-[40px] left-[60px] dark:bg-[#2b2d31] bg-zinc-200">
      <Primary connectionId={params.id}/>
      {children}
    </div>
  )
}

export default layout
