"use client";
import { DBMember, MemberWithUser } from '@/types';
import React, { useEffect, useState } from 'react'
import UserAvatar from '../UserAvatar';
import ActionTooltip from '../action-tooltip';
import { Crown, Edit, FileIcon, Skull, Trash } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getContentType } from '@/lib/fileType';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { chat } from '@/schemas/chat';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import qs from "query-string";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { onOpen } from '@/features/modelSlice';

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

  const isAdmin = currentMember?.role === "admin"
  const isModerator = currentMember?.role === "moderator"
  const isOwner = currentMember?.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const [fileType, setFileType] = useState('');

  const isPDF = fileType.includes("pdf");
  const isImage = fileType.includes("jpeg" || "jpg" || "png" || "gif");

  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof chat>>({
    resolver: zodResolver(chat),
    defaultValues: {
      content: content
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async(values : z.infer<typeof chat>) => {
    try {
      const url = qs.stringifyUrl({
        url : `${socketUrl}/${id}`,
        query : socketQuery
      })

      form.reset();
      setIsEditing(false);

      await axios.patch(url, values);
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    const handleKeyDown = (event : any) => {
      if(event.key === "Enter" || event.keyCode === 27) {
        setIsEditing(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    form.reset({
      content : content
    })
  }, [content]);

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
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input 
                            disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200" placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black dark:text-white transition duration-300">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, Enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit 
                onClick={() => setIsEditing(true)}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => dispatch(onOpen({
                type : "deleteMessage",
                data : {
                  apiUrl : `${socketUrl}/${id}`,
                  query : socketQuery
                }
              }))}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem
