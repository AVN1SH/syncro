import { currentUser } from '@/lib/currentUser'
import dbConnect from '@/lib/dbConnect';
import { serializeData } from '@/lib/serialized';
import UserModel from '@/model/user.model';
import { PlainFriendWithUser, PlainUserWithFriendWithUser } from '@/types';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'
import ChatPrimary from '@/components/windows/ChatPrimary';
import ChatNavToggle from '@/components/ChatNavToggle';
import FriendConversationModel from '@/model/friendConversation.model';

const layout = async ({children, params} : {children : React.ReactNode; params : {id : string}}) => {

  await dbConnect();
  
  const user = await currentUser();
  console.log(user);

  if(!user) {
    return redirect("/sign-in");
  }

  const userData = await UserModel.findById(new mongoose.Types.ObjectId(user._id)).populate({
    path : "friends",
    populate : {
      path : "requestingUser requestedUser",
    },
  }).lean().exec() as PlainUserWithFriendWithUser;

  const plainUserData : PlainUserWithFriendWithUser = serializeData(userData);

  const isRequestedUser = plainUserData.friends?.some((friend : PlainFriendWithUser) => friend.requestingUser._id === user._id && friend.status === "pending");
  const isRequestingUser = plainUserData.friends?.some((friend : PlainFriendWithUser) => friend.requestedUser._id === user._id && friend.status === "pending");
  const acceptedFriends = plainUserData.friends?.some((friend : PlainFriendWithUser) => friend.status === "accepted");

  const friendIds = plainUserData.friends?.filter((friend : PlainFriendWithUser) => friend.status === "accepted").map((friend : PlainFriendWithUser) => {
    if(friend.requestingUser._id === user._id) return friend.requestedUser._id;
    else return friend.requestingUser._id;
  });

  const conversation : any = await FriendConversationModel.find({
    $or : [
      { userOne : new mongoose.Types.ObjectId(user._id), userTwo : {$in : friendIds.map((f) => new mongoose.Types.ObjectId(f))} },
      { userOne : {$in : friendIds.map((f) => new mongoose.Types.ObjectId(f))}, userTwo : new mongoose.Types.ObjectId(user._id) },
    ]
  }).exec();

  const friends : any = plainUserData.friends?.map((friend : PlainFriendWithUser) => {
    const otherUser = friend.requestingUser._id === user._id ? friend.requestedUser : friend.requestingUser;

    const friendConversation = conversation.find((c : any) => String(c.userOne) === otherUser._id || String(c.userTwo).toString() === otherUser._id);

    return {
      ...friend,
      lastUpdated : friendConversation?.updatedAt || friend.updatedAt
    }
  })

  return (
    <div>
      <ChatNavToggle 
        plainUserData={plainUserData}
        user={user}
        acceptedFriends={acceptedFriends}
        isRequestedUser={isRequestedUser}
        isRequestingUser={isRequestingUser}
      />
      <div className="md:flex init:hidden h-full w-[250px] z-10 flex-col fixed inset-y-0 top-0 left-[60px] dark:bg-[#2b2d31] bg-zinc-100 shadow-[0px_0px_10px_rgba(0,0,0,0.4)] overflow-hidden">
        <ChatPrimary
          plainFriends={friends}
          user={user}
          acceptedFriends={acceptedFriends}
          isRequestedUser={isRequestedUser}
          isRequestingUser={isRequestingUser}
        />
      </div>
      {children}
    </div>
  )
}

export default layout