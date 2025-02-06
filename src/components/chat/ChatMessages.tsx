"use client";
import { DBMember, MessageWithMemberWithUser, PlainMember } from '@/types';
import React, { Fragment, useRef, ElementRef } from 'react'
import ChatWelcome from './ChatWelcome';
import { useChatQuery } from '@/hooks/useChatQuery';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatItem from './ChatItem';
import { format } from "date-fns";
import StoreProvider from '@/store/StoreProvider';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatScroll } from '@/hooks/useChatScroll';

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface Props {
  name ?: string;
  member ?: PlainMember;
  chatId ?: string;
  apiUrl : string;
  socketurl : string;
  socketQuery : Record<string, string>;
  paramKey : "threadId" | "conversationId";
  paramValue ?: string;
  type : "thread" | "conversation";
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketurl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: Props) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
  })
  useChatSocket({queryKey, addKey, updateKey})
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if(status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    )
  }
  if(status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong..!
        </p>
      </div>
    )
  }
  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome
        type={type}
        name={name || ''}
      />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="size-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button 
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
              onClick={() => fetchNextPage()}
            >
              Load previous messages
            </button>
          )}

        </div>
      )}
      <StoreProvider>
        <div className="flex flex-col-reverse mt-auto">
          {data?.pages?.map((group, i) => (
            <Fragment key={i}>
              {group.items.map((message : MessageWithMemberWithUser) => (
                <ChatItem
                  key={String(message?._id)}
                  id={String(message?._id)}
                  currentMember={member}
                  member={message?.member}
                  content={message?.content}
                  fileUrl={message?.fileUrl}
                  deleted={message?.deleted}
                  timeStamp={format(new Date(message?.createdAt), DATE_FORMAT)}
                  isUpdated={message?.updatedAt !== message?.createdAt}
                  socketUrl={socketurl}
                  socketQuery={socketQuery}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </StoreProvider>
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatMessages
