"use client";
import React, { useEffect, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import ActionTooltip from '../action-tooltip';
import UserAvatar from '../UserAvatar';
import { signOut } from 'next-auth/react';
import { Separator } from '../ui/separator';
import { DoorOpen, Dot } from 'lucide-react';
import { useSocket } from '../providers/SocketProvider';

interface Props {
  imageUrl : string;
  name : string;
  username : string;
  email : string;
  type : "self" | "other";
  className ?: string;
  userId : string;
}

const ProfileInfo = ({imageUrl, name, username, email, type, className, userId} : Props) => {
  const {socket, isConnected, onlineUsers} = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  useEffect(() => {
    onlineUsers.forEach((user) => {
      if(user === userId) {
        setIsOnline(true);
      }
    })
  }, [socket, isConnected, onlineUsers])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <ActionTooltip label="Profile" side="right">
          <div>
            <UserAvatar  
              src={imageUrl}
              userName={name}
              className={`size-10 cursor-pointer hover:opacity-80 duration-300 ${className}`}
            />
          </div>
        </ActionTooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" 
      className="dark:bg-zinc-900 bg-zinc-200 w-[260px] rounded-xl">
        <div className="flex flex-col p-4 relative z-0">
          <div className="bg-yellow-500 left-0 top-0 right-0 absolute h-24 -z-10 rounded-xl" />
          {imageUrl ? <img src={imageUrl} className="self-center rounded-full size-[150px]" />
           : <div className={`self-center flex items-center justify-center rounded-full dark:bg-zinc-700 bg-zinc-200 size-[150px]`}>
            <p className="capitalize font-black text-amber-500 text-6xl">{name.charAt(0)}</p>
          </div>}
          <p className="font-bold text-zinc-200 mt-2">My Profile</p>
          <div className="flex flex-col gap-1 mt-5">
            <p className="flex items-center justify-between text-xs text-slate-400">
              <span>{name}</span>
              <span>{username}</span>
            </p>
            <Separator className="w-full dark:bg-zinc-800 bg-zinc-300" />
          </div>
          <div className="flex flex-col gap-1 mt-3">
            <p className="text-xs text-slate-400">
              {email}
            </p>
            <Separator className="w-full dark:bg-zinc-800 bg-zinc-300" />
          </div>
          {isOnline ? <div className="flex items-center text-green-500 font-bold mt-3 relative">
            Online 
            <Dot className="absolute size-[50px] text-green-500 left-10" />
            <Dot className="absolute size-[50px] text-green-500 animate-ping left-10" />
          </div>
          : <div className="flex items-center text-red-500 font-bold mt-3 relative">
              Offline 
            </div>
          }
          {type === "self" && <button
            onClick={() => signOut({callbackUrl : "/sign-in"})}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold flex gap-2 items-center justify-center mt-3 rounded-lg p-2 duration-300"
          >
            <DoorOpen />
            Sign Out!
          </button>}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileInfo;