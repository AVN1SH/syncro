"use client";
import { DBMember, MessageWithMemberWithUser } from '@/types';
import React, { Fragment } from 'react'
import ChatWelcome from './ChatWelcome';
import { useChatQuery } from '@/hooks/useChatQuery';
import { Loader2, ServerCrash } from 'lucide-react';
import ChatItem from './ChatItem';
import { format } from "date-fns";
import StoreProvider from '@/store/StoreProvider';

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface Props {
  name : string;
  member ?: DBMember;
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
  const queryKey = `chat:${chatId}`
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
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1 flex items-start justify-end flex-col gap-2 ">
        <ChatWelcome
          type={type}
          name={name}
        />
        <StoreProvider>
          <div className="flex flex-col-reverse mt-auto w-full">
            {data?.pages?.map((group, i) => (
              <Fragment key={i}>
                {group.items.map((message : MessageWithMemberWithUser) => (
                  <ChatItem
                    key={String(message._id)}
                    id={String(message._id)}
                    currentMember={member}
                    member={message.member}
                    content={message.content}
                    fileUrl={message.fileUrl}
                    deleted={message.deleted}
                    timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    isUpdated={message.updatedAt !== message.createdAt}
                    socketUrl={socketurl}
                    socketQuery={socketQuery}
                  />
                ))}
              </Fragment>
            ))}
          </div>
        </StoreProvider>
      </div>
    </div>
  )
}

export default ChatMessages
