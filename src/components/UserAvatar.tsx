import { DBMember } from '@/types';
import React from 'react'
import {Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

interface Props {
  src ?: string;
  className ?: string;
  user ?: DBMember;
  userName ?: string;
}

const UserAvatar = ({src, className, userName} : Props) => {
  return (
    <Avatar className={cn(
      "h-7 w-7 md:h-10 md:w-10",
      className
    )}>
      {src 
        ? <AvatarImage src={src} className={className} />
        : <div className={`flex items-center justify-center rounded-full dark:bg-zinc-700 bg-zinc-200 size-10 ${className}`}>
        <p className="capitalize font-black text-amber-500">{userName?.charAt(0)}</p>
      </div>
      }
    </Avatar>
  )
}

export default UserAvatar