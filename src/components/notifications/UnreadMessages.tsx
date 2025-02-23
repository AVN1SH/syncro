"use client"
import { PlainInboxWithUser } from "@/types";
import UserAvatar from "../UserAvatar";
import { Check, ChevronDown, MessageSquareText } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useInboxSocket } from "@/hooks/useInboxSocket";
import { useSession } from "next-auth/react";
import axios from "axios";
import { formatTextWithLinks } from "@/lib/formateTextWithLinks";

interface Props {
  deleteAllInboxMsg : boolean;
  updateDeleteAllInboxMsg : () => void;
  updateAllMessages : (inboxId : string) => void;
  allMessages : PlainInboxWithUser[];
}


const UnreadMessages = ({deleteAllInboxMsg, updateDeleteAllInboxMsg,  updateAllMessages, allMessages} : Props) => {
  const [collapse, setCollapse] = useState<Map<string, boolean>>(new Map());

  const deleteOne = async (inboxMessageId : string) => {
    try {
      const res = await axios.delete(`/api/deleteInboxMessage/${inboxMessageId}`, {
        data : {
          inboxMessageId
        }
      });

      if(res.data) {
        updateAllMessages(res.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    if(deleteAllInboxMsg) {
      updateDeleteAllInboxMsg();
    }
  }, [deleteAllInboxMsg])

  return (
    <div className="space-y-4 overflow-y-auto h-[390px] scrollbar-dark">
      {allMessages.filter((m) => m.type !== "system").length > 0 && allMessages.map((message) => (
        <div key={message._id} className="flex flex-col gap-2 items-center px-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <div className="flex items-center gap-4">
                <UserAvatar 
                  src={message.sender.imageUrl} 
                  userName={message.sender.name} 
                  className="h-8 w-8 md:h-8 md:w-8 rounded-xl"
                />
                <div className="flex flex-col">
                  <p className="font-bold text-[14px]">{message.title}</p>
                  <p className="text-xs">From: {message.sender.name}</p>
                </div>
              </div>
              <p className="text-amber-500 text-[10px]">{format(message.createdAt, "dd/MM/yyyy, HH:mm")}</p>
            </div>
            <div className="flex items-center gap-2">
              <button>
                <Check 
                  onClick={() => deleteOne(message._id)}
                  className="bg-zinc-100 dark:bg-zinc-900 hover:text-amber-500 duration-300 p-[6px] rounded-full" 
                />
              </button>

              <button onClick={() => setCollapse(new Map(collapse.set(message._id, !collapse.get(message._id))))}>
                <ChevronDown className={`bg-zinc-100 dark:bg-zinc-900 hover:text-amber-500 duration-300 p-[6px] rounded-full ${collapse.get(message._id) ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
          <div className={`flex flex-col bg-zinc-50 dark:bg-zinc-700 w-full rounded-md h-0 duration-300 overflow-hidden shadow-lg ${!collapse.get(message._id) ? "h-fit p-3 opacity-100" : "h-0 p-0 opacity-0"}`}>
            <h1 className="text-zinc-400 font-bold flex items-start gap-1"><MessageSquareText className="size-6 pt-[2px]" />{message.title}</h1>
            <div className="px-2">
              {message.type === "fileLink" && 
                <a 
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(message.content, '_blank', 'noopener,noreferrer');
                  }}
                  href={message.content} 
                  className="text-[14px] text-blue-500 hover:underline"
                >
                    {message.content}
                </a>
              }
              {message.type === "text" && (
                <p className="text-[14px] whitespace-pre-line pl-5">{formatTextWithLinks(message.content)}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {allMessages.filter((m) => m.type !== "system").length === 0 && (
        <div className="h-[390px] flex items-center justify-center">
          <p className="text-center text-zinc-400">No messages..!</p>
        </div>
      )}
    </div>
  )
}
export default UnreadMessages;