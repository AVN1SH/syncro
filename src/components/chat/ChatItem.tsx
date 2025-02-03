"use client";
import { DBMember, MemberWithUser } from '@/types';
import React, { useEffect, useState } from 'react'
import UserAvatar from '../UserAvatar';
import ActionTooltip from '../action-tooltip';
import { Crown, Edit, FileIcon, Skull, Trash } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getContentType } from '@/lib/fileType';

interface Props {
  id : string;
  content : string;
  member : MemberWithUser;
  timeStamp : string;
  fileUrl : string;
  deleted : boolean;
  currentMember ?: DBMember;
  isUpdated : boolean;
  socketUrl : string;
  socketQuery : Record<string, string>;
}

const roleIconMap = {
  "guest" : null,
  "moderator" : <Skull className="size-4 ml-2 text-yellow-500" />,
  "admin" : <Crown className="size-4 ml-2 text-rose-500" />
}

const ChatItem = ({
  id,
  content,
  member,
  timeStamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = currentMember?.role === "admin"
  const isModerator = currentMember?.role === "moderator"
  const isOwner = currentMember?.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const [fileType, setFileType] = useState('');

  const isPDF = fileType.includes("pdf")
  const isImage = fileType.includes("jpeg" || "jpg" || "png" || "gif")

  useEffect(() => {
    const getFileType = async () => {
      if(fileUrl) {
        const response = await getContentType(fileUrl);
        setFileType(response);
      }
    }

    getFileType();
  }, [fileUrl])

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="goup flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.user?.imageUrl}/>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.user?.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timeStamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image 
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-yellow-500/10">
              <FileIcon className="h-10 w-10 fill-yellow-200 stroke-yellow-400" />
              
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-yellow-500 dark:text-yellow-400 hover:underline overflow-hidden break-all text-center"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p className={cn(
              "text-sm text-zinc-600 dark:text-zinc-300",
              deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
            )}>
              {content}
              {isUpdated && !deleted && (
                <span className=" text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit className="size-4 ml-2 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition cursor-pointer" />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash className="size-4 ml-2 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition cursor-pointer" />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem
