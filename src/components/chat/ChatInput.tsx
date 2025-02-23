"use client";

import { chat } from '@/schemas/chat';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormItem,
  FormField
} from "@/components/ui/form";
import { Loader2, Plus, Send } from 'lucide-react';
import axios from 'axios';
import qs from "query-string"
import { useDispatch } from 'react-redux';
import { onOpen } from '@/features/modelSlice';
import EmojiPicker from '../EmojiPicker';
import { usePathname, useRouter } from 'next/navigation';
import TextareaAutosize from "react-textarea-autosize";
import { useSession } from 'next-auth/react';
import { useSocket } from '../providers/SocketProvider';

interface Props {
  apiUrl : string;
  query : Record<string, any>;
  name ?: string;
  type : "thread" | "conversation" | "friendConversation";
  friendUserId ?: string;
  friendId ?: string;
}

const ChatInput = ({apiUrl, query, name, type, friendUserId, friendId} : Props) => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { socket, isConnected } = useSocket();
  const [onlinePageUsers, setOnlinePageUsers] = useState<string[]>([]);

  const form = useForm<z.infer<typeof chat>>({
    resolver: zodResolver(chat),
    defaultValues : {
      content : ''
    }
  })

  const handleKeyDown = (e : React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMultiLine = form.getValues("content").includes("\n");

    if(e.key === "Enter" && !e.shiftKey) {
      if(isMultiLine) return;
      
      e.preventDefault();
      if(form.getValues("content").trim()) {
        onSubmit(form.getValues())
      }
    }
  }

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values : z.infer<typeof chat>) => {
    try {
      const url = qs.stringifyUrl({
        url : apiUrl,
        query
      })

      await axios.post(url, values);
      if(type === "friendConversation" && friendUserId && !onlinePageUsers.some((f) => f === friendUserId) ) {
        await axios.post("/api/socket/notifications", {
          type : "text",
          title : "New Message",
          content : values.content,
          friendUserId : friendUserId
        })
      }
      form.reset();
      // router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(type === "friendConversation" && socket?.connected && session?.user._id) {

      const joinData = { friendId, userId : session.user._id}

      socket.emit("joinPage", joinData)

      socket.on("activePageUsers", (userIds: string[]) => {
        setOnlinePageUsers(userIds);
      });

      return () => {
        socket.emit("leavePage", joinData);
        socket.off("activePageUsers");
    };
    }
  }, [friendId, friendUserId, status, socket, type, isConnected])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => dispatch(onOpen({
                      type : "messageFile",
                      data : {
                        apiUrl,
                        query
                      }
                    }))}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-md p-1 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <TextareaAutosize
                    disabled={isLoading}
                    minRows={1}
                    maxRows={6}
                    onKeyDown={handleKeyDown}
                    className="pl-14 pr-24 py-3 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-bisible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 resize-none w-full rounded-lg flex scrollbar-hide focus:outline-none !h-12"
                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <div className="absolute top-7 right-20">
                   <EmojiPicker
                    onChange={(emoji : string) => field.onChange(`${field.value}${emoji}`)}
                   />
                  </div>
                  <button 
                    type='submit'
                    disabled={isLoading}
                    className='absolute top-6 right-8 bg-yellow-500 cursor-pointer size-[32px] flex items-center justify-center rounded-lg hover:bg-yellow-600 transition-all duration-300'>
                    {isLoading ? <Loader2 className="text-white size-4 animate-spin" /> : <Send className="text-white size-5" />}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput
