"use client"
import { RootState } from '@/store/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddFriend from '../friends/AddFriend';
import PendingFriend from '../friends/PendingFriend';
import { PlainFriendWithUser } from '@/types';
import AllFriend from '../friends/AllFriend';
import OnlineFriend from '../friends/OnlineFriend';
import { onChange } from '@/features/chatNavigateSlice';
import Image from 'next/image';

interface Props {
  friends : PlainFriendWithUser[];
}

const Friends = ({friends} : Props) => {
  const activeName = useSelector((state : RootState) => state.createChatNavSlice.activeName);
  const dispatch = useDispatch();

  return (
    <div className="h-full flex flex-col relative">
      {activeName !== "add" && !friends?.length && <div className="flex-1 flex flex-col items-center justify-center">
        <Image alt="sad-emoji" width={200} height={200} src="/images/sadEmoji.svg" 
          className="object-contain w-[200px] h-[200px] repeat-0 mx-auto drop-shadow-[4px_10px_10px_rgba(172,71,4,1)]"
        />
        <span className="font-semibold mt-4 text-zinc-400 flex init:flex-col md:flex-row gap-2 init:items-center md:items-end md:text-start text-center">
          <span>
            {activeName === "online" && "You currently have no any friends.."}
            {activeName === "pending" && "There are no any pending friends.."}
            {activeName === "all" && "You currently have no any friends.."}
            <span className="text-yellow-500">! </span> 
            Make your friends now.
          </span>
          <div className='flex relative overflow-hidden pt-6'>
            <button 
            onClick={() => dispatch(onChange("add"))}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 rounded text-[16px] duration-150 peer text-nowrap">
              Add Friends
            </button>
            <Image alt="sad-emoji" width={40} height={40} src="/images/sadEmoji.svg"
              className="object-contain w-[40px] h-[40px] repeat-0 absolute right-8 -z-10 bottom-[-15px] peer-hover:bottom-1 duration-300"
            />
          </div>
        </span>
      </div>}
      {friends?.length > 0 && <>
        {activeName === "online" && <OnlineFriend friends={friends}/>}
        {activeName === "pending" && <PendingFriend friends={friends}/>}
        {activeName === "all" && <AllFriend friends={friends} />}
      </>}
      {activeName === "add" && <AddFriend />}
    </div>
  )
}

export default Friends