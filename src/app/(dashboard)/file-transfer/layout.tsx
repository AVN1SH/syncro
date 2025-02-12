"use client"
import ConnectionSearch from '@/components/connections/ConnectionSearch';
import { ScrollArea } from '@/components/ui/scroll-area';
import Primary from '@/components/windows/Primary'
import { currentUser } from '@/lib/currentUser'
import dbConnect from '@/lib/dbConnect';
import { cn } from '@/lib/utils';
import ConnectionModel from '@/model/connection.model';
import { Separator } from '@radix-ui/react-select';
import { Link, MessageCircleMore, MessagesSquare, Smile, SmilePlus, Video, Wifi, WifiHigh, Zap } from 'lucide-react';
import mongoose from 'mongoose';
import { redirect, usePathname } from 'next/navigation';
import React from 'react'

const layout = ({children} : {children : React.ReactNode}) => {

  const pathname = usePathname();

  return (
    <div className="flex h-full w-[250px] z-10 flex-col fixed inset-y-0 top-0 left-[60px] dark:bg-[#2b2d31] bg-zinc-100 overflow-hidden">
      <div className="border-solid border-zinc-900 border-b-[2px] h-[50px] w-full">
        <div className="relative text-center h-full w-full">
          <div className="absolute w-full h-full top-0 left-0 -z-10 opacity-10">
            <Zap size="12" className="absolute top-[20px] left-2 animate-bounce text-yellow-600"/>
            <Smile className="absolute top-1 left-[30px] animate-pulse" size={20} />
            <SmilePlus className="text-yellow-600 absolute bottom-1 right-[100px] animate-pulse" />
            <WifiHigh className="absolute top-[19px] right-3 animate-pulse"/>
            <Smile size="16" className="absolute bottom-3 left-[100px] animate-pulse" />
            <MessagesSquare size="14" className="text-yellow-600 absolute bottom-2 left-[70px]" />
            <MessageCircleMore className="absolute bottom-2 right-[70px] animate-bounce" />
            <Wifi size="14" className="absolute bottom-1 left-[45px] animate-bounce" />
            <Video size="16" className=" text-yellow-600 absolute bottom-5 right-[45px]" />
          </div>
          <div className="w-full text-md font-semibold flex items-center justify-center h-[50px] border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-300/100 dark:hover:bg-zinc-700/50 transition px-2 gap-2">
            <div>
              <span className="text-yellow-500 text-2xl font-bold">F</span>
              <span className="font-thin text-xl">ile Transfer</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-2">
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          By Link
        </p>
      </div>

      <div className="mx-3 space-y-[2px] mt-3">
        <button 
          // onClick={onClick}
          className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", pathname?.includes("sender") ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent")}
        >
          <Link className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", pathname?.includes("sender") && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
            Generate Link
          </p>
        </button>
      </div>

      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>

      <div className="flex items-center justify-between p-2">
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          Online Members
        </p>
      </div>

      <ScrollArea className="h-[50px] px-3">
        <div className="mt-2">
          <ConnectionSearch 
            data={[
              // {
              //   label : "Members",
              //   type : "member",
              //   data : members?.map((member : MemberWithUser) => ({
              //     id : member._id,
              //     name : member.user.name,
              //     icon : roleIconMap[member.role]
              //   }))
              // }
            ]}
          />
        </div>
      </ScrollArea>

      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>

      {children}
    </div>
  )
}

export default layout