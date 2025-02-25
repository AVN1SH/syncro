import { Hash, Link } from 'lucide-react';
import React from 'react'
import MobileToggle from '../MobileToggle';
import UserAvatar from '../UserAvatar';
import { SocketIndicator } from '../ui/socket-indicator';
import ChatVideoButton from './ChatVideoButton';
import Inbox from '../notifications/Inbox';
import { PlainInboxWithUser } from '@/types';

interface Props {
  connectionId ?: string;
  name : string;
  imageUrl ?: string;
  type : "thread" | "conversation" | "generateLink";
  inboxMessages : PlainInboxWithUser[];
  userId : string;
}

const SecondaryWindowHeader = ({
  connectionId,
  name,
  imageUrl,
  type,
  inboxMessages,
  userId
} : Props) => {
  return (
    <div className={`border-solid border-zinc-200 dark:border-zinc-800 border-b-[2px] h-[50px] flex items-center justify-between px-1 md:px-3 flex-shrink-0 dark:bg-[#313338] bg-white ${!connectionId && "pl-8 md:pl-3"}`}>
      <div className="flex items-center font-semibold gap-2">
        {connectionId && <MobileToggle 
          connectionId={connectionId}
        />}
        {type === "thread" && (
          <Hash className="w-5 h-5 text-zinc-400 dark:text-zinc-400 md:mr-2" />
        )}
        {type === "conversation" && (
          <UserAvatar
            src={imageUrl}
            userName={name}
            className="h-8 w-8 md:h-8 md:w-8"
          />
        )}
        {type === "generateLink" && (
          <Link className="size-5 text-zinc-50 dark:text-zinc-400 mr-2" />
        )}
        <p className="font-semibold text-sm md:text-md text-black dark:text-white">
          {name.length > 10 ? name.slice(0, 10) + "..." : name}
        </p>
      </div>
      <div className="flex items-center gap-1 md:gap-3">
        {type === "conversation" && (
          <ChatVideoButton />
        )}
        {type !== "generateLink" && <SocketIndicator />}
        <div className="w-[2px] h-7 bg-zinc-400 dark:bg-zinc-700 ml-1" />
        <Inbox 
          inboxMessages={inboxMessages}
          userId={userId}
        />
      </div>
    </div>
  )
}

export default SecondaryWindowHeader;