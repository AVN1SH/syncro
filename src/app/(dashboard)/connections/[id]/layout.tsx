import Primary from '@/components/windows/Primary'
import { currentUser } from '@/lib/currentUser'
import dbConnect from '@/lib/dbConnect';
import ConnectionModel from '@/model/connection.model';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({children, params} : {children : React.ReactNode; params : {id : string}}) => {

  await dbConnect();
  
  const user = await currentUser();

  if(!user) {
    return redirect("/sign-in");
  }

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
        "members.user": new mongoose.Types.ObjectId(user._id),
      },
    },
  ])

  if(!connection.length) {
    return redirect("/connections");
  }

  return (
    <div>
      <div className="init:hidden md:flex h-full w-[250px] z-10 flex-col fixed inset-y-0 top-0 left-[60px] dark:bg-[#2b2d31] bg-zinc-100 shadow-[0px_0px_10px_rgba(0,0,0,0.4)]">
        <Primary connectionId={params.id}/>
      </div>
      {children}
    </div>
  )
}

export default layout