"use client"
import { RootState } from '@/store/store';
import React from 'react'
import { useSelector } from 'react-redux'
import mongoose from 'mongoose';
import { Separator } from '../ui/separator';
import AddFriend from '../friends/AddFriend';
import PendingFriend from '../friends/PendingFriend';
import { PlainFriend, PlainFriendWithUser } from '@/types';
import AllFriend from '../friends/AllFriend';
import OnlineFriend from '../friends/OnlineFriend';

interface Props {
  friends : PlainFriendWithUser[];
}

const Friends = ({friends} : Props) => {
  const activeName = useSelector((state : RootState) => state.createChatNavSlice.activeName);

  return (
    <div className="h-full flex flex-col relative">
      {activeName !== "add" && !friends?.length && <div className="flex-1 flex flex-col items-center justify-center">
        <img src="/images/sadEmoji.svg" 
          className="object-contain w-[200px] h-[200px] repeat-0 mx-auto drop-shadow-[4px_10px_10px_rgba(172,71,4,1)]"
        />
        <span className="font-semibold mt-4 text-zinc-400 flex gap-2 items-center pt-6 relative overflow-hidden">
          <span>
            {activeName === "online" && "You currently have no any friends.."}
            {activeName === "pending" && "There are no any pending friends.."}
            {activeName === "all" && "You currently have no any friends.."}
            <span className="text-yellow-500">! </span> 
            Make your friends now.
          </span>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 rounded text-[16px] duration-150 peer">
            Add Friends
          </button>
          <img src="/images/sadEmoji.svg"
            className="object-contain w-[40px] h-[40px] repeat-0 absolute right-7 -z-10 bottom-[-15px] peer-hover:bottom-1 duration-300"
          />
        </span>
      </div>}
      {friends && <>
        {activeName === "online" && <OnlineFriend friends={friends}/>}
        {activeName === "pending" && <PendingFriend friends={friends}/>}
        {activeName === "add" && <AddFriend />}
        {activeName === "all" && <AllFriend friends={friends} />}
      </>}
    </div>
  )
}

export default Friends
