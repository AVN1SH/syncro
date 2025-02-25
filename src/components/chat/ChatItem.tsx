"use client";
import { DBUser, MemberWithUser, PlainMember } from '@/types';
import React, { useEffect, useState } from 'react'
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
import { Button } from '../ui/button';
import qs from "query-string";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { onOpen } from '@/features/modelSlice';
import { useRouter, useParams } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import ProfileInfo from '../navigation/ProfileInfo';
import { formatTextWithLinks } from '@/lib/formateTextWithLinks';


interface Props {
  id : string;
  content : string;
  member ?: MemberWithUser;
  user ?: DBUser;
  currentUserId ?: string;
  timeStamp : string;
  fileUrl : string;
  deleted : boolean;
  currentMember ?: PlainMember;
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
  user,
  currentUserId
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const isAdmin = currentMember?.role === "admin"
  const isModerator = currentMember?.role === "moderator"
  const isOwner = currentMember?._id === String(member?._id) || currentUserId === String(user?._id);
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const [fileType, setFileType] = useState('');

  const isPDF = fileType.includes("pdf");
  const isImage = fileType.includes("jpeg" || "jpg" || "png" || "gif");

  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  
  const onMemberClick = () => {
    if(user) return;
    if(String(member?._id) === currentMember?._id) {
      return;
    }

    router.push(`/connections/${params?.id}/conversations/${String(member?._id)}`);
  }

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
      if(event.keyCode === 27) {
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
  }, [content, form]);

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
    <div className="relative group flex items-center hover:bg-black/5 px-2 md:px-4 py-4 transition w-full">
      <div className="goup flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
          <ProfileInfo 
            imageUrl={user ? user.imageUrl : member?.user.imageUrl || ""}
            name={user ? user.name : member?.user.name || ''}
            username={user ? user.username : member?.user.username || ''}
            email={user ? user.email : member?.user.email || ''}
            userId={user ? String(user._id) : String(member?.user._id) || ''}
            type="other"
            className="h-6 w-6 md:h-10 md:w-10"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick} className="font-semibold text-xs md:text-sm hover:underline cursor-pointer">
                {user ? user.name : member?.user?.name}
              </p>
              {member && <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>}
            </div>
            <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400">
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
              "text-xs md:text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-line",
              deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
            )}>
              {formatTextWithLinks(content)}
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
                className="flex w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <TextareaAutosize
                            minRows={1}
                            maxRows={6}
                            disabled={isLoading}
                            className="p-1 md:p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 w-full scrollbar-hide focus:outline-none resize-none rounded-lg text-xs md:text-[16px]" placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} className="bg-yellow-500 hover:bg-yellow-600 text-black dark:text-white transition duration-300 text-xs md:text-[16px] h-6 px-1 md:px-4 md:h-8">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel it.
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
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-rose-500 transition" />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem