"use client";
import { cn } from '@/lib/utils';
import { PlainFriendWithUser, PlainUser } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import UserAvatar from '../UserAvatar';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import axios from 'axios';

interface Props {
  friend : PlainFriendWithUser;
  userId : string;
}

const RequestedFriend = ({friend, userId} : Props) => {
  const params = useParams();
  const router = useRouter();
  const [friendUser, setFriendUser] = useState<PlainUser | null>(null);


  const onRevert = async () => {
    try {
      const response = await axios.delete("/api/friend-request", {
        data : {requestedUserId : friendUser?._id}
      })
      if(response) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(friend.requestingUser._id === userId){
      setFriendUser(friend.requestedUser)
    } else { setFriendUser(friend.requestingUser); }
  }, [friend]);

  return friend.status === "pending" && friend.requestedUser._id === friendUser?._id && (
    <div className="mx-3">
      <div className={cn("group rounded-md flex items-center justify-between w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.friendId === String(friend._id) ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent cursor-pointer")}>
        <button 
          className={"flex-1 pl-2 py-2 flex items-center justify-between"}
        >
          <div className="flex items-center gap-x-2">
            <UserAvatar
              src={friendUser?.imageUrl}
              userName={friendUser?.name}
              className="h-8 w-8 md:h-8 md:w-8"
            />
            <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.friendId === String(friend._id) && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
              {friendUser?.name}
            </p>
          </div>
          <Separator className="rotate-90 w-6 bg-zinc-600" />
        </button>
        <div className="pr-1 flex items-center gap-1">
          <Badge
            onClick={onRevert}
            className="py-0 px-2 bg-rose-600 text-white hover:text-rose-600 text-[10px]" variant="secondary" >Revert</Badge>
          
        </div>
      </div>
    </div>
  )
}

export default RequestedFriend