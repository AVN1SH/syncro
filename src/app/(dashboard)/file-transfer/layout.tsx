import TransferNavToggle from '@/components/TransferNavToggle';
import TransferPrimary from '@/components/windows/TransferPrimary';
import { currentUser } from '@/lib/currentUser'
import dbConnect from '@/lib/dbConnect';
import { serializeData } from '@/lib/serialized';
import UserModel from '@/model/user.model';
import { PlainUserWithFriendWithUser } from '@/types';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({children} : {children : React.ReactNode}) => {

  await dbConnect();
  
  const user = await currentUser();

  if(!user) {
    return redirect("/sign-in");
  }

  const userData = await UserModel.findById(new mongoose.Types.ObjectId(user._id)).populate({
    path : "friends",
    populate : {
      path : "requestingUser requestedUser",
    },
  }).lean().exec() as PlainUserWithFriendWithUser;

  const plainUserData = serializeData(userData);

  return (
    <div>
      <TransferNavToggle 
        plainUserData={plainUserData}
        userId={user._id}
      />
      <div className="md:flex init:hidden h-full w-[250px] z-10 flex-col fixed inset-y-0 top-0 left-[60px] dark:bg-[#2b2d31] bg-zinc-100 overflow-hidden">
        <TransferPrimary 
          plainUserData={plainUserData}
          userId={user._id}
        />
      </div>
      {children}
    </div>
  )
}

export default layout