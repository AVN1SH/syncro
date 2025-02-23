"use client"
import { PlainFriendWithUser } from '@/types'
import { useSession } from 'next-auth/react';
import React from 'react'
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { format } from 'date-fns';
import ProfileInfo from '../navigation/ProfileInfo';

interface Props {
  friends : PlainFriendWithUser[];
}
const AllFriend = ({friends} : Props) => {
  const {data : session} = useSession();
  const router = useRouter();

  const onAccept = async (requestingUserId : string) => {
    try {
      const response = await axios.patch("/api/friend-request", {
        requestingUserId
      })
      if(response) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onReject = async (requestingUserId : string) => {
    try {
      const response = await axios.delete("/api/friend-request", {
        data : {requestingUserId}
      })
      if(response) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onRevert = async (requestedUserId : string) => {
    try {
      const response = await axios.delete("/api/friend-request", {
        data : {requestedUserId}
      })
      if(response) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex-1 overflow-auto">
      {friends.some((f) => f.status === "accepted" ) && 
      <div className="flex-1 flex flex-col gap-y-6 p-4">
        <p className="font-bold text-zinc-400">FRIENDS</p>
        {friends.map((friend) => {
          if(friend.status !== "accepted") return
          const otherUser = friend.requestingUser._id === session?.user._id ? friend.requestedUser : friend.requestingUser;
          return  (
            <div key={friend._id}
              onClick={() => router.push(`/chat/${friend._id}`)}
              className="flex items-center justify-between gap-2 p-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 rounded-lg duration-300 cursor-pointer">
              <div className="flex items-center gap-2">
                <ProfileInfo 
                  imageUrl={otherUser.imageUrl}
                  name={otherUser.name}
                  username={otherUser.username}
                  email={otherUser.email}
                  userId={otherUser._id}
                  type="other"
                />
                <div>
                  <p className="font-bold">{otherUser.name}</p>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600">@{otherUser.username}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <Badge 
                  variant="outline"
                  className="bg-amber-500 text-white cursor-default">Friend</Badge>
                </div>
            </div>
          )
        })}
        <Separator className="dark:bg-zinc-700 bg-zinc-200" />
      </div>}
      {friends.some((f) => f.requestedUser._id === session?.user._id && f.status === "pending" ) && 
      <div className="flex-1 flex flex-col gap-y-6 p-4">
        <p className="font-bold text-zinc-400">FRIEND REQUESTS FOR YOU</p>
        {friends.map((friend) => {
          if(friend.status !== "pending") return
          if(!(friend.requestedUser._id === session?.user._id)) return
          return  (
            <div key={friend._id} className="flex items-center justify-between gap-2 p-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 rounded-lg duration-300">
              <div className="flex items-center gap-2">
                <ProfileInfo 
                  imageUrl={friend.requestingUser.imageUrl}
                  name={friend.requestingUser.name}
                  username={friend.requestingUser.username}
                  email={friend.requestingUser.email}
                  userId={friend.requestingUser._id}
                  type="other"
                />
                <div>
                  <p className="font-bold">{friend.requestingUser.name}</p>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600">@{friend.requestingUser.username}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <Badge 
                  onClick={() => onAccept(friend.requestingUser._id)}
                  className="bg-emerald-500 text-white hover:text-emerald-600 hover:bg-white cursor-pointer">Accept Request</Badge>
                  <Badge 
                  onClick={() => onReject(friend.requestingUser._id)}
                  className="bg-red-600 text-white hover:text-red-600 hover:bg-white cursor-pointer">Decline</Badge>
                </div>
            </div>
          )
        })}
        <Separator className="dark:bg-zinc-700 bg-zinc-200" />
      </div>}

      {friends.some((f) => f.requestingUser._id === session?.user._id && f.status === "pending" ) && 
      <div className="flex-1 flex flex-col gap-y-4 p-4">
        <p className="font-bold text-zinc-400">FRIEND REQUESTS SENT BY YOU</p>
        {friends.map((friend) => {
          if(friend.status !== "pending") return
          if(!(friend.requestingUser._id === session?.user._id)) return
          return  (
            <div key={friend._id} className="flex items-center justify-between gap-2 p-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 rounded-lg duration-300">
              <div className="flex items-start gap-2">
                <ProfileInfo 
                  imageUrl={friend.requestedUser.imageUrl}
                  name={friend.requestedUser.name}
                  username={friend.requestedUser.username}
                  email={friend.requestedUser.email}
                  userId={friend.requestedUser._id}
                  type="other"
                />
                <div>
                  <p className="font-bold">{friend.requestedUser.name}</p>
                  <p className="text-xs dark:text-zinc-400 text-zinc-600">@{friend.requestedUser.username}</p>
                </div>
                <p className="text-xs dark:text-zinc-400 text-zinc-700 ml-3">{format(friend.createdAt, "dd/mm/yyyy hh-mm")}</p>
              </div>
              <Badge 
                onClick={() => onRevert(friend.requestedUser._id)}
                className="bg-red-600 text-white hover:text-red-600 hover:bg-white cursor-pointer">Revert Request</Badge>
            </div>
          )
        })}
      </div>}
    </div>
  )
}

export default AllFriend
