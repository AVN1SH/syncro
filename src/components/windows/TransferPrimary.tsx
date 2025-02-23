"use client"
import { MessageCircleMore, MessagesSquare, Smile, SmilePlus, Video, Wifi, WifiHigh, Zap } from 'lucide-react'
import React from 'react'
import ByLink from '../transfer/ByLink'
import { Separator } from '../ui/separator'
import OnlineFriendList from '../transfer/OnlineFriendList'
import { PlainUserWithFriendWithUser } from '@/types'

interface Props {
  plainUserData : PlainUserWithFriendWithUser;
  userId : string;
}

const TransferPrimary = ({plainUserData, userId} : Props) => {
  return (
    <div>
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

      <ByLink />
      
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>

      <div className="flex items-center justify-between p-2">
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          Online Friends
        </p>
      </div>

      {plainUserData.friends?.map((friend : any) => (
        <OnlineFriendList 
          key={friend._id}
          friend={friend}
          userId={userId}
        />
      ))}
    </div>
  )
}

export default TransferPrimary