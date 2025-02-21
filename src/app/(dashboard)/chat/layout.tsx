import ConnectionSearch from '@/components/connections/ConnectionSearch';
import Friends from '@/components/friends/Friends';
import FriendList from '@/components/friends/FriendList';
import RequestedFriend from '@/components/friends/RequestedFriend';
import RequestingFriend from '@/components/friends/RequestingFriend';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/currentUser'
import dbConnect from '@/lib/dbConnect';
import { serializeData } from '@/lib/serialized';
import UserModel from '@/model/user.model';
import { PlainFriendWithUser, PlainUserWithFriendWithUser } from '@/types';
import { Clock10, Handshake, Mail, MessageCircleMore, MessagesSquare, Smile, SmilePlus, Video, Wifi, WifiHigh, Zap } from 'lucide-react';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

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

  const plainUserData = serializeData(userData);

  const isRequestedUser = plainUserData.friends?.some((friend : PlainFriendWithUser) => friend.requestingUser._id === user._id && friend.status === "pending");
  const isRequestingUser = plainUserData.friends?.some((friend : PlainFriendWithUser) => friend.requestedUser._id === user._id && friend.status === "pending");
  const acceptedFriends = plainUserData.friends?.some((friend : PlainFriendWithUser) => friend.status === "pending");

  return (
    <div className="flex h-full w-[250px] z-10 flex-col fixed inset-y-0 top-0 left-[60px] dark:bg-[#2b2d31] bg-zinc-100 shadow-[0px_0px_10px_rgba(0,0,0,0.4)] overflow-hidden">
      <div className="border-solid border-zinc-900 border-b-[2px] h-[50px] w-full">
        <div className="relative text-center h-full w-full">
          <div className="absolute w-full h-full top-0 left-0 -z-10 opacity-10">
            <Zap size="12" className="absolute top-[20px] left-2 animate-bounce text-yellow-600"/>
            <Smile className="absolute top-1 left-[30px] animate-pulse" size={20} />
            <SmilePlus className="text-yellow-600 absolute bottom-1 right-[100px] animate-pulse" />
            <WifiHigh className="absolute top-[19px] right-3 animate-pulse"/>
            <Smile size="16" className="absolute bottom-3 left-[100px] animate-pulse" />
            <MessagesSquare size="14" className="text-yellow-600 absolute bottom-2 left-[70px]" />
            <MessageCircleMore className="absolute bottom-2 right-[70px] animate-bounce" />
            <Wifi size="14" className="absolute bottom-1 left-[45px] animate-bounce" />
            <Video size="16" className=" text-yellow-600 absolute bottom-5 right-[45px]" />
          </div>
          <div className="w-full text-md font-semibold flex items-center justify-center h-[50px] border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-300/100 dark:hover:bg-zinc-700/50 transition px-2 gap-2">
            <div>
              <span className="text-yellow-500 text-2xl font-bold">C</span>
              <span className="font-thin text-xl">hat</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[50px] px-3">
        <div className="mt-2">
          <ConnectionSearch 
            data={[
              {
                label : "Friends",
                type : "friends",
                data : plainUserData?.friends?.map((friend : any) => ({
                  id : friend._id,
                  name : friend.requestingUser.name === user.name ? friend.requestedUser.name : friend.requestingUser.name,
                }))
              }
            ]}
          />
        </div>
      </ScrollArea>

      <Friends />
      
      {acceptedFriends && <>
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>
       <div className="flex items-center justify-between p-2">
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 flex gap-2 items-center">
          <Handshake className="text-yellow-500 size-5" /> Friends
        </p>
      </div>
      </>}

      {plainUserData.friends?.map((friend : any) => (
        <FriendList 
          key={friend._id}
          friend={friend}
          userId={user._id}
        />
      ))}

      {isRequestingUser && <>
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>
        <div className="flex items-center justify-between p-2">
          <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 flex gap-2 items-center">
            <Clock10 className="text-yellow-500 size-5" /> Friend Requests
          </p>
        </div>
      </>}
      
      {plainUserData.friends?.map((friend : any) => (
        <RequestingFriend 
          key={friend._id}
          friend={friend}
          userId={user._id}
        />
      ))}

      {isRequestedUser && <>
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>

        <div className="flex items-center justify-between p-2">
          <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 flex gap-2 items-center">
            <Mail className="text-yellow-500 size-5" /> Sent Requests
          </p>
        </div>
      </>}

      {plainUserData.friends?.map((friend : any) => (
        <RequestedFriend 
          key={friend._id}
          friend={friend}
          userId={user._id}
        />
      ))}
      {/* <div className="fixed left-[310px] top-0 right-0 bottom-0 flex flex-col h-full">
        <div className="border-solid border-zinc-800 border-b-[2px] h-[50px] flex justify-between">
          <FriendsTopNav />
          <Inbox />
        </div>
      </div> */}
      {children}
    </div>
  )
}

export default layout