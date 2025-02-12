"use client";

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import ActionTooltip from '../action-tooltip';
import UserAvatar from '../UserAvatar';
import { signOut, useSession } from 'next-auth/react';
import { Separator } from '../ui/separator';
import { DoorOpen, Dot } from 'lucide-react';
import { Button } from '../ui/button';

const ProfieInfo = () => {
  const { data : session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <ActionTooltip label="Profile" side="left">
          <UserAvatar  
            src={session?.user.imageUrl}
            className="cursor-pointer hover:opacity-80 transition-[2s]"
          />
        </ActionTooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" 
      className="dark:bg-zinc-900 bg-zinc-200 w-[260px] rounded-xl">
        <div className="flex flex-col p-4">
          <img src={session?.user.imageUrl} className="self-center rounded-full size-[150px]" />
          <p className="font-bold text-zinc-200 mt-2">My Profile</p>
          <div className="flex flex-col gap-1 mt-5">
            <p className="flex items-center justify-between text-xs text-slate-400">
              <span>{session?.user.name}</span>
              <span>{session?.user.username}</span>
            </p>
            <Separator className="w-full bg-zinc-700" />
          </div>
          <div className="flex flex-col gap-1 mt-3">
            <p className="text-xs text-slate-400">
              {session?.user.email}
            </p>
            <Separator className="w-full bg-zinc-700" />
          </div>
          <div className="flex items-center text-yellow-500 font-bold mt-3 relative">
            Online 
            <Dot className="absolute size-[50px] text-green-500 left-10" />
            <Dot className="absolute size-[50px] text-green-500 animate-ping left-10" />
          </div>
          <button
            onClick={() => signOut({callbackUrl : "/sign-in"})}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold flex gap-2 items-center justify-center mt-3 rounded-lg p-2 duration-300"
          >
            <DoorOpen />
            Sign Out!
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfieInfo;