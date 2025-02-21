import { PlainInboxWithUser } from "@/types";
import UserAvatar from "../UserAvatar";
import { Check, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import Link from "next/link";

interface Props {
  inboxMessages : PlainInboxWithUser[];
}

const ForYouMessages = ({inboxMessages} : Props) => {
  return (
    <div className="space-y-4 overflow-y-auto h-[390px] scrollbar-dark">
      {inboxMessages.filter((m) => m.type === "system").length > 0 && inboxMessages.map((message) => (
        <div className="flex flex-col gap-2 items-center px-3">
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
                <Check className="bg-zinc-900 hover:text-amber-500 duration-300 p-[6px] rounded-full" />
              </button>
              <button>
                <ChevronDown className="bg-zinc-900 hover:text-amber-500 duration-300 p-[6px] rounded-full" />
              </button>
            </div>
          </div>
          <div className="flex flex-col p-3 bg-zinc-700 w-full rounded-md">
            <h1 className="text-zinc-400 font-bold">{message.title}</h1>
            <div className="px-2">
              <p className="text-[12px] whitespace-pre-line">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
      {inboxMessages.filter((m) => m.type === "system").length === 0 && (
        <div className="h-[390px] flex items-center justify-center">
          <p className="text-center text-zinc-400">No messages..!</p>
        </div>
      )}
    </div>
  )
}

export default ForYouMessages
