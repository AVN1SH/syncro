"use client"
import React, { ReactNode, useEffect } from 'react'
import { faBolt, faCommentDots, faCommentSms, faFile, faGears, faHandshakeAngle, faIdBadge, faMessage, faPlusCircle, faSadCry, faShareNodes, faSignOut, faSmile, faTrash, faUserGroup, faVideo, faWifi, faWifi3 } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ConnectionWithMembersWithUsers, DBMember } from '@/types'
import { Member } from '@/model/member.model'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { faThreads } from '@fortawesome/free-brands-svg-icons'
import { useDispatch } from 'react-redux'
import { onOpen } from '@/features/modelSlice'
import mongoose, { Types } from 'mongoose'

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

  return (
    <div className="border-solid border-zinc-900 border-b-[2px] h-[50px] w-full">
      <div className="relative text-center h-full w-full">
        <div className="absolute w-full h-full top-0 left-0 -z-10 opacity-10">
          <FontAwesomeIcon icon={faBolt} color="yellow" size="xs" bounce className="absolute top-[20px] left-2"/>
          <FontAwesomeIcon icon={faSmile} spin className="absolute top-1 left-[30px]" />
          <FontAwesomeIcon icon={faSmile} color="yellow" spin className="absolute bottom-1 right-[100px]" />
          <FontAwesomeIcon icon={faWifi3} className="absolute top-[19px] right-3 animate-pulse"/>
          <FontAwesomeIcon icon={faSmile} size="xs" className="absolute bottom-3 left-[100px] animate-pulse" />
          <FontAwesomeIcon icon={faCommentSms} color="yellow" size="xs" className="absolute bottom-2 left-[70px]" />
          <FontAwesomeIcon icon={faCommentDots} className="absolute bottom-2 right-[70px] animate-bounce" />
          <FontAwesomeIcon icon={faWifi} size="xs" className="absolute bottom-1 left-[45px] animate-bounce" />
          <FontAwesomeIcon icon={faVideo} color="yellow" size="xs" bounce className="absolute bottom-5 right-[45px]" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="focus:outline-none w-full"
          >
            <div className="w-full text-md font-semibold flex items-center justify-center h-[50px] border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-300/100 dark:hover:bg-zinc-700/50 transition px-2 gap-2">
              <div>
                <span className="text-yellow-500 text-2xl font-bold">{connectionName[0].toUpperCase()}</span>
                <span className="font-thin text-xl">{connectionName.slice(1)}</span>
              </div>
              <ChevronDown className="h-5 w-5"/>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[250px] bg-[#ddddddce] dark:bg-[#2b2d31ce] rounded-none rounded-b-lg  relative -top-1 text-black dark:text-neutral-400 hover-bg-none backdrop-blur-sm">

            {isModerator && (
              <DropdownMenuItem 
                onClick={() => dispatch(onOpen({
                  type : "invite",
                  data : { connectionId, inviteCode }
                }))}
                className="cursor-pointer font-semibold hover:text-yellow-400 text-[16px] text-yellow-400 focus:bg-[#16171a5a] transition-[2s_ease-in-out] group focus:text-yellow-500"
              >
                <FontAwesomeIcon icon={faShareNodes} className="mr-5 group-hover:mr-6 group-hover:text-xl transition-[2s_ease-in-out] text-lg" />
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
                className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-neutral-300 text-[16px] transition-[2s_ease-in-out] group"
              >
                <FontAwesomeIcon icon={faGears} className="mr-4 group-hover:mr-5 group-hover:text-lg transition-[2s_ease-in-out]" />
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
                className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-neutral-300 text-[16px] transition-[2s_ease-in-out] group"
              >
                <FontAwesomeIcon icon={faUserGroup} className="mr-4 group-hover:mr-6 group-hover:text-lg transition-[2s_ease-in-out]" />
                Manage Members
              </DropdownMenuItem>
            )}

            {isModerator && 
            <DropdownMenuItem 
              onClick={() => dispatch(onOpen({
                type : "createThread",
                data : {
                  
                }
              }))}
              className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-neutral-300 text-[16px] transition-[2s_ease-in-out] group"
            >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-5 group-hover:mr-6 group-hover:text-lg transition-[2s_ease-in-out]" />
                Create Thread
            </DropdownMenuItem>}

            {isModerator && <DropdownMenuSeparator className="bg-yellow-500" />}

            {isAdmin && <DropdownMenuItem className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-red-600 text-[16px] transition-[2s_ease-in-out] text-red-500 group">
              <FontAwesomeIcon icon={faTrash} className="mr-5 group-hover:mr-6 group-hover:text-lg transition-[2s_ease-in-out]" />
              Delete Connection
            </DropdownMenuItem>}
            
            {!isAdmin && <DropdownMenuItem className="cursor-pointer font-semibold focus:bg-[#16171a5a] focus:text-red-600 text-[16px] transition-[2s_ease-in-out] text-red-500 group">
              <FontAwesomeIcon icon={faSignOut} className="mr-5 group-hover:mr-6 group-hover:text-lg transition-[2s_ease-in-out]" />
              Leave Connection
            </DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    </div>
  )
}

export default PrimaryWindowHeader
