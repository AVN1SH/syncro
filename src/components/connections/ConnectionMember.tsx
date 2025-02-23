"use client";
import { cn } from '@/lib/utils';
import { ConnectionThreadMemberUser, DBFriend, MemberWithUser } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { Crown, Skull } from 'lucide-react';
import FriendRequest from '../friends/FriendRequest';
import { Separator } from '../ui/separator';
import ProfileInfo from '../navigation/ProfileInfo';

interface Props {
  member : MemberWithUser;
  connection : ConnectionThreadMemberUser;
  friendStatus : DBFriend["status"];
}

const roleIconMap = {
  "admin" : <Crown className="h-4 w-4 text-rose-500" />,
  "moderator" : <Skull className="h-4 w-4 text-yellow-500" />,
  "guest" : null
}

const ConnectionMember = ({member, connection, friendStatus} : Props) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const handleOnClick = () => {
    router.push(`/connections/${params?.id}/conversations/${member._id}`)
  }

  return (
    <div className="mx-3">
      <div className={cn("group rounded-md flex items-center justify-between w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.memberId === String(member._id) ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent cursor-pointer")}>
        <div 
          onClick={handleOnClick}
          className={"flex-1 pl-2 py-2 flex items-center justify-between"}
        >
          <div className="flex items-center gap-x-2">
            <ProfileInfo
              imageUrl={member.user.imageUrl}
              name={member.user.name}
              username={member.user.username}
              email={member.user.email}
              userId={String(member.user._id)}
              type="other"
              className="h-8 w-8 md:h-8 md:w-8"
            />
            <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.memberId === String(member._id) && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
              {(member.user.name).length > 10 ? (member.user.name).slice(0, 10) + "..." : member.user.name}
            </p>
            {icon}
          </div>
          <Separator className="rotate-90 w-6 bg-zinc-600" />
        </div>
        <FriendRequest 
          requestedUserId={String(member.user._id)}
          friendStatus={friendStatus}
        />
      </div>
    </div>
  )
}

export default ConnectionMember