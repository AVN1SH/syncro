"use client";

import { Hash } from 'lucide-react';
import React from 'react'

interface Props {
  type : "thread" | "conversation" | "friendConversation";
  name : string;
}

const ChatWelcome = ({type, name} : Props) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "thread" && (
        <div className="flex items-center gap-x-2">
          <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
            <Hash className="h-12 w-12 text-white" />
          </div>
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "thread" ? "Welcome to #" : ""}{name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "thread"
          ? `This is the start of the #${name} thread.`
          : `This is the start of your conversation with ${name}.`
        }
      </p>
    </div>
  )
}

export default ChatWelcome
