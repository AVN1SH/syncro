"use client";
import { cn } from '@/lib/utils';
import { ConnectionThreadMemberUser, DBFriend, MemberWithUser, PlainFriendWithUser, PlainUser } from '@/types';
import { faShield, faShieldDog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import UserAvatar from '../UserAvatar';
import { Crown, Dot, Skull } from 'lucide-react';
import FriendRequest from '../friends/FriendRequest';
import { Separator } from '../ui/separator';
import { format } from 'date-fns';
import { useSocket } from '../providers/SocketProvider';
import { Badge } from '../ui/badge';

interface Props {
  friend : PlainFriendWithUser;
  userId : string;
}

const OnlineFriendList = ({friend, userId} : Props) => {
  const params = useParams();
  const router = useRouter();
  const [friendUser, setFriendUser] = useState<PlainUser | null>(null);
  const {socket, isConnected, onlineUsers} = useSocket();


  const handleOnClick = () => {
    router.push(`/file-transfer/${friend?._id}`);
  }

  useEffect(() => {
    const otherUser = friend.requestingUser._id === userId ? friend.requestedUser : friend.requestingUser;

    const online = onlineUsers.some((user) => user === otherUser._id);

    if(online) setFriendUser(otherUser);

  }, [friend, socket, onlineUsers, isConnected, userId]);

  return friend.status === "accepted" && friendUser && (
    <div className="mx-3">
      <div className={cn("group rounded-md flex items-center justify-between w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.friendId === String(friend._id) ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent cursor-pointer")}>
        <button 
          onClick={handleOnClick}
          className={"flex-1 pl-2 py-2 flex items-start justify-between"}
        >
          <div className="flex items-center gap-x-2">
          <div>
            <UserAvatar  
              src={friendUser.imageUrl}
              userName={friendUser.name}
              className="h-8 w-8 md:h-8 md:w-8"
            />
          </div>
            <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.friendId === String(friend._id) && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
              {friendUser?.name.length > 10 ? friendUser?.name.slice(0, 10) + "..." : friendUser?.name}
            </p>
          </div>
          <div className="relative mr-2">
            <Badge className="bg-green-500 text-white" variant="outline">
              Online
            </Badge>
            <Dot className="absolute text-green-600 size-14 -top-[22px] -right-6" />
            <Dot className="absolute text-green-600 size-14 -top-[22px] -right-6 animate-ping" />
          </div>
        </button>
      </div>
    </div>
  )
}

export default OnlineFriendList
