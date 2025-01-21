import { DBMember } from '@/types';
import React from 'react'
import {Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface Props {
  src ?: string;
  className ?: string;
  user : DBMember;
}

const UserAvatar = ({src, className, user} : Props) => {
  return (
    <Avatar className={cn(
      "h-7 w-7 md:h-10 md:w-10",
      className
    )}>
      {src 
        ? <AvatarImage src={src} className={className} />
        : <FontAwesomeIcon icon={faUser} className="bg-zinc-300 w-full h-full pt-1 text-zinc-600" />
      }
    </Avatar>
  )
}

export default UserAvatar
