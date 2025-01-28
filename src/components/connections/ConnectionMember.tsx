"use client";
import { cn } from '@/lib/utils';
import { ConnectionThreadMemberUser, MemberWithUser } from '@/types';
import { faShield, faShieldDog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import UserAvatar from '../UserAvatar';

interface Props {
  member : MemberWithUser;
  connection : ConnectionThreadMemberUser;
}

const roleIconMap = {
  "admin" : <FontAwesomeIcon icon={faShieldDog} className="h-4 w-4 text-rose-500" />,
  "moderator" : <FontAwesomeIcon icon={faShield} className="h-4 w-4 text-yellow-500" />,
  "guest" : null
}

const ConnectionMember = ({member, connection} : Props) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  return (
    <div className="mx-3">
      <button 
        className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.memberId === String(member._id) ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent")}
      >
        <UserAvatar
          src={member.user.imageUrl}
          className="h-8 w-8 md:h-8 md:w-8"
        />
        <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.memberId === String(member._id) && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
          {member.user.name}
        </p>
        {icon}
      </button>
    </div>
  )
}

export default ConnectionMember
