"use client"
import React, { useState } from 'react'
import { DBMember } from '@/types'
import { Member } from '@/model/member.model'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ChevronDown, DoorOpen, MessageCircleMore, MessageSquarePlus, MessagesSquare, ServerCog, Share2, Smile, SmilePlus, Trash2, UsersRound, Video, Wifi, WifiHigh, Zap } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { onOpen } from '@/features/modelSlice'
import mongoose from 'mongoose'

interface Props {
  connectionName : string;
  role ?: Member["role"];
  inviteCode : string;
  connectionId : string;
  profilePhotoUrl : string;
  connectionMembers : DBMember[];
  connectionUserId : mongoose.Schema.Types.ObjectId;
}

const PrimaryWindowHeader = ({
  connectionName,
  role,
  inviteCode,
  connectionId,
  profilePhotoUrl,
  connectionMembers,
  connectionUserId
} : Props) => {

  const dispatch = useDispatch();

  const isAdmin = role === "admin";
  const isModerator = isAdmin || role === "moderator";
  const [toRotate, setToRotate] = useState(false);

  return (
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
        <DropdownMenu onOpenChange={() => setToRotate(!toRotate)}>
          <DropdownMenuTrigger
            className="focus:outline-none w-full">
            <div className="w-full text-md font-semibold flex items-center justify-center h-[50px] border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-300/100 dark:hover:bg-zinc-700/50 transition px-2 gap-2">
              <div>
                <span className="text-yellow-500 text-2xl font-bold">{connectionName[0].toUpperCase()}</span>
                <span className="font-thin text-xl">{connectionName.slice(1)}</span>
              </div>
              <ChevronDown className={`size-5 ${!toRotate ? "rotate-0" : "rotate-180"} transition-all duration-300`}/>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[250px] bg-[#ddddddce] dark:bg-[#2b2d31ce] rounded-none rounded-b-lg  relative -top-1 text-black dark:text-neutral-400 hover-bg-none backdrop-blur-sm">

            {isModerator && (
              <DropdownMenuItem 
                onClick={() => dispatch(onOpen({
                  type : "invite",
                  data : { connectionId, inviteCode }
                }))}
                className="cursor-pointer font-semibold text-[16px] text-yellow-400 focus:bg-[#16171a5a] transition-[2s] group focus:text-yellow-500"
              >
                <Share2 className="mr-1 group-hover:size-[20px] transition-[2s] scale-110 group-focus:text-yellow-500 text-yellow-400" />
                Invite People
              </DropdownMenuItem>
            )}

            {isAdmin && (
              <DropdownMenuItem 
                onClick={() => dispatch(onOpen({
                  type : "editConnection",
                  data : {
                    connectionId,
                    connectionName,
                    profilePhotoUrl
                  }
                }))}
                className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-neutral-300 text-[16px] transition-[2s] group"
              >
                <ServerCog className="mr-1 group-hover:size-[20px] transition-[2s] scale-110 group-focus:text-neutral-300 dark:text-zinc-400" />
                Connection Settings
              </DropdownMenuItem>
            )}

            {isAdmin && (
              <DropdownMenuItem 
                onClick={() => dispatch(onOpen({
                  type : "members",
                  data : {
                    connectionId,
                    connectionMembers,
                    connectionUserId
                  }
                }))}
                className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-neutral-300 text-[16px] transition-[2s] group"
              >
                <UsersRound className="mr-1 group-hover:size-[20px] transition-[2s] scale-110 group-focus:text-neutral-300 dark:text-zinc-400" />
                Manage Members
              </DropdownMenuItem>
            )}

            {isModerator && 
            <DropdownMenuItem 
              onClick={() => dispatch(onOpen({
                type : "createThread",
                data : {}
              }))}
              className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-neutral-300 text-[16px] transition-[2s] group"
            >
                <MessageSquarePlus className="mr-1 group-hover:size-[20px] transition-[2s] scale-110 group-focus:text-neutral-300 dark:text-zinc-400" />
                Create Thread
            </DropdownMenuItem>}

            {isModerator && <DropdownMenuSeparator className="bg-yellow-500" />}

            {isAdmin && 
              <DropdownMenuItem 
                onClick={() => dispatch(onOpen({
                  type : "deleteConnection",
                  data : {
                    connectionId,
                    connectionName
                  }
                }))}
                className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-red-600 text-[16px] transition-[2s] text-red-500 group"
              >
              <Trash2 className="mr-1 group-hover:size-[20px] transition-[2s] scale-110 group-focus:text-red-600 text-red-500" />
              Delete Connection
            </DropdownMenuItem>}
            
            {!isAdmin && 
            <DropdownMenuItem 
              onClick={() => dispatch(onOpen({
                type : "leaveConnection",
                data : {
                  connectionId,
                  connectionName
                }
              }))}
              className="cursor-pointer font-semibold focus:bg-[#16171a5a]  text-[16px] transition-[2s] text-red-500 group focus:text-red-600"
            >
              <DoorOpen className="mr-1 group-hover:size-[20px] group-focus:text-red-600 text-red-500 transition-[2s] scale-110" />
              Leave Connection
            </DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    </div>
  )
}

export default PrimaryWindowHeader
