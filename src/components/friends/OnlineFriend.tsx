"use client"
import { PlainFriendWithUser, PlainUser } from '@/types';
import React, { useEffect, useState } from 'react'
import { useSocket } from '../providers/SocketProvider';
import { useSession } from 'next-auth/react';
import { Dot } from 'lucide-react';
import ProfileInfo from '../navigation/ProfileInfo';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Props {
  friends : PlainFriendWithUser[];
}
const OnlineFriend = ({friends} : Props) => {

  const { socket, isConnected, onlineUsers } = useSocket();
  const {data : session} = useSession();
  const [onlineFriends, setOnlineFriends] = useState<PlainUser[]>([]);
  const router = useRouter();

  useEffect(() => {
    setOnlineFriends([]);
    friends.map((friend) => {
      if(friend.status !== "accepted") return;

      const otherUser = friend.requestingUser._id === session?.user._id ? friend.requestedUser : friend.requestingUser;

      const isOnline = onlineUsers.includes(otherUser._id);
      
      if(isOnline) setOnlineFriends(prev => [...prev, otherUser])
    });
  }, [onlineUsers, isConnected, socket, session?.user._id]);
  
  return (
    <div className="flex-1 p-4 overflow-auto">

      {onlineFriends.length === 0 && <div className="h-full flex flex-col items-center justify-center">
        <div className="flex-1">
          <Image alt="sad-image" width={500} height={500} src="/images/sad.svg" className="size-full opacity-85" />
        </div>
        <p className="flex-1 text-zinc-400">There is no online friends right now..<span className="text-amber-500">!</span> Check back later.</p>
      </div>}

      {onlineFriends.length > 0 && 
      <div className="flex-1 flex flex-col gap-y-6 px-1 py-4 md:px-4">
        <p className="font-bold text-zinc-400">FRIEND REQUESTS FOR YOU</p>
        {onlineFriends.map((friend) => {
          return  (
            <div 
              key={friend._id}
              onClick={() => router.push(`/chat/${friends.find((f) => 
                  f.requestedUser._id === friend._id || f.requestingUser._id === friend._id
                )?._id
              }`)} 
              className="flex items-center justify-between gap-2 p-1 md:p-2 dark:hover:bg-zinc-700 hover:bg-zinc-200 rounded-lg duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ProfileInfo 
                  imageUrl={friend.imageUrl}
                  name={friend.name}
                  username={friend.username}
                  email={friend.email}
                  userId={friend._id}
                  type="other"
                />
                <div>
                  <p className="font-bold md:text-[16px] text-sm">{friend.name}</p>
                  <p className="text-[10px] md:text-xs dark:text-zinc-400 text-zinc-600">@{friend.username}</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <Badge 
                  className="bg-green-500 text-white cursor-default relative" variant="outline">
                    Online
                    <Dot className="text-green-600 size-16 absolute -right-7 -top-[30px]" />
                    <Dot className="text-green-600 size-16 absolute -right-7 -top-[30px] animate-ping" />
                  </Badge>
                  <Badge 
                  className="bg-amber-600 text-white cursor-default init:hidden md:block" variant="outline">Friend</Badge>
                </div>
            </div>
          )
        })}
        <Separator className="bg-zinc-700" />
      </div>}
      
    </div>
  )
}

export default OnlineFriend