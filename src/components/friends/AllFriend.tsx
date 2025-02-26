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
import { Ban } from 'lucide-react';
import { toast } from 'sonner';

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
        toast("Request Accepted..!", {
          action: {
            label: "ok",
            onClick: () => {},
          },
        })
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
        toast("Request Rejected..!", {
          action: {
            label: "ok",
            onClick: () => {},
          },
        })
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
        toast("Reverted Successfully", {
          action: {
            label: "ok",
            onClick: () => {},
          },
        })
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onUnfriend = async (friendId : string) => {
    try {
      const response = await axios.delete("/api/friend-request", {
        data : {friendId}
      })
      if(response) {
        toast("Unfriend Successfully", {
          action: {
            label: "ok",
            onClick: () => {},
          },
        })
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex-1 overflow-auto">
      {friends.some((f) => f.status === "accepted" ) && 
      <div className="flex-1 flex flex-col gap-y-6 px-1 py-4 md:px-4">
        <p className="font-bold text-zinc-400">FRIENDS</p>
        {friends.map((friend) => {
          if(friend.status !== "accepted") return
          const otherUser = friend.requestingUser._id === session?.user._id ? friend.requestedUser : friend.requestingUser;
          return  (
            <div key={friend._id}
              onClick={() => router.push(`/chat/${friend._id}`)}
              className="flex items-center justify-between gap-2 p-1 md:p-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 rounded-lg duration-300 cursor-pointer">
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
                  <p className="font-bold md:text-[16px] text-sm">{otherUser.name}</p>
                  <p className="text-[10px] md:text-xs dark:text-zinc-400 text-zinc-600">@{otherUser.username}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className="bg-amber-500 text-white cursor-default init:hidden md:block"
                  >Friend</Badge>
                  <Badge 
                    onClick={() => onUnfriend(otherUser._id)}
                    className="bg-red-600 text-white hover:text-red-600 hover:bg-white cursor-pointer"
                  >UnFriend</Badge>
                </div>
            </div>
          )
        })}
        <Separator className="dark:bg-zinc-700 bg-zinc-200" />
      </div>}
      {friends.some((f) => f.requestedUser._id === session?.user._id && f.status === "pending" ) && 
      <div className="flex-1 flex flex-col gap-y-6 px-1 py-4 md:px-4">
        <p className="font-bold text-zinc-400">FRIEND REQUESTS FOR YOU</p>
        {friends.map((friend) => {
          if(friend.status !== "pending") return
          if(!(friend.requestedUser._id === session?.user._id)) return
          return  (
            <div key={friend._id} className="flex items-center justify-between gap-2 p-1 md:p-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 rounded-lg duration-300">
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
                  <p className="font-bold md:text-[16px] text-sm">{friend.requestingUser.name}</p>
                  <p className="text-[10px] md:text-xs dark:text-zinc-400 text-zinc-600">@{friend.requestingUser.username}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <Badge 
                  onClick={() => onAccept(friend.requestingUser._id)}
                  className="bg-emerald-500 text-white hover:text-emerald-600 hover:bg-white cursor-pointer">Accept <span className="init:hidden md:block">Request</span></Badge>
                  <Badge 
                  onClick={() => onReject(friend.requestingUser._id)}
                  className="bg-red-600 text-white hover:text-red-600 hover:bg-white cursor-pointer init:hidden md:block">Decline</Badge>
                  <Ban className="md:hidden size-5 bg-red-600 text-white hover:text-red-600 hover:bg-white p-[2px] rounded-full" />
                </div>
            </div>
          )
        })}
        <Separator className="dark:bg-zinc-700 bg-zinc-200" />
      </div>}

      {friends.some((f) => f.requestingUser._id === session?.user._id && f.status === "pending" ) && 
      <div className="flex-1 flex flex-col gap-y-4 px-1 py-4 md:px-4">
        <p className="font-bold text-zinc-400">FRIEND REQUESTS SENT BY YOU</p>
        {friends.map((friend) => {
          if(friend.status !== "pending") return
          if(!(friend.requestingUser._id === session?.user._id)) return
          return  (
            <div key={friend._id} className="flex items-center justify-between gap-2 p-1 md:p-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 rounded-lg duration-300">
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
                <p className="text-xs dark:text-zinc-400 text-zinc-700 ml-3 init:hidden md:block">{format(friend.createdAt, "dd/MM/yyyy hh-mm")}</p>
              </div>
              <Badge 
                onClick={() => onRevert(friend.requestedUser._id)}
                className="bg-red-600 text-white hover:text-red-600 hover:bg-white cursor-pointer">Revert <span className="init:hidden md:block">Request</span></Badge>
            </div>
          )
        })}
      </div>}
    </div>
  )
}

export default AllFriend