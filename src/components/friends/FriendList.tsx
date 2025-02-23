"use client";
import { cn } from '@/lib/utils';
import { PlainFriendWithUser, PlainUser } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import UserAvatar from '../UserAvatar';
import { format } from 'date-fns';

interface Props {
  friend : PlainFriendWithUser & { lastUpdated : Date };
  userId : string;
}

const FriendList = ({friend, userId} : Props) => {
  const params = useParams();
  const router = useRouter();
  const [friendUser, setFriendUser] = useState<PlainUser | null>(null);


  const handleOnClick = () => {
    router.push(`/chat/${friend?._id}`);
  }

  useEffect(() => {
    if(friend.requestingUser._id === userId) setFriendUser(friend.requestedUser);
    else setFriendUser(friend.requestingUser);
  }, [friend]);

  return friend.status === "accepted" && friendUser && (
    <div className="mx-3">
      <div className={cn("group rounded-md flex items-center justify-between w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.friendId === String(friend._id) ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent cursor-pointer")}>
        <button 
          onClick={handleOnClick}
          className={"flex-1 pl-2 py-2 flex items-start justify-between"}
        >
          <div className="flex items-center gap-x-2">
            <UserAvatar  
              src={friendUser.imageUrl}
              userName={friendUser.name}
              className="h-8 w-8 md:h-8 md:w-8"
            />
            <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.friendId === String(friend._id) && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
              {friendUser?.name}
            </p>
          </div>
            <p className="text-[8px] text-amber-500 pr-1">{
              format(new Date(friend.lastUpdated), "dd/MM/yyyy") === format(new Date(), "dd/MM/yyyy") 
              ? format(new Date(friend.lastUpdated), "hh:mm") 
              : format(new Date(friend.lastUpdated), "dd/MM/yyyy")
            }</p>
        </button>
      </div>
    </div>
  )
}

export default FriendList