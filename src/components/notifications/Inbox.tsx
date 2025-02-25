"use client"
import { faInbox, faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ActionTooltip from "../action-tooltip"
import { Separator } from "../ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { CheckCheck, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import ForYouMessages from "./ForYouMessages"
import { PlainInboxWithUser } from "@/types";
import UnreadMessages from "./UnreadMessages"
import axios from "axios"
import { useInboxSocket } from "@/hooks/useInboxSocket"
import { useRouter } from "next/navigation"


interface Props {
  inboxMessages : PlainInboxWithUser[];
  userId : string;
}

const Inbox = ({inboxMessages, userId} : Props) => {
  const inboxKey = `inbox:${userId}`

  const [deleteAllInboxMsg, setDeleteAllInboxMsg] = useState(false);
  const { newInboxMsg } = useInboxSocket({inboxKey});
  const [allMessages, setAllMessages] = useState(inboxMessages);

  const router = useRouter();

  const deleteAll = async () => {
    try {
      const res = await axios.delete("/api/deleteInboxMessage");
      if(res) {
        setDeleteAllInboxMsg(true);
        setAllMessages([]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateDeleteAllInboxMsg = () => {
    setDeleteAllInboxMsg(false);
  }

  const udpateAllMessages = (inboxId : string) => {
    setAllMessages((prev) => prev.filter((msg) => msg._id !== inboxId));
  }

  useEffect(() => {
    if(newInboxMsg) {
      setAllMessages((prev) => [newInboxMsg, ...prev]);
    }

  }, [newInboxMsg]);

  const [isActive, setIsActive] = useState("forYou");
  return (
    <div className="pr-1 md:pr-4 pl-1 md:pl-2 flex items-center gap-2 md:gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Separator className="mx-2 h-[calc(100%-20px)] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[2px] my-auto"/>
          <ActionTooltip side="top" label="Inbox">
            <div className="relative">
              <FontAwesomeIcon icon={faInbox} 
              className="text-zinc-400 dark:hover:text-white hover:text-black duration-150 text-xl md:text-2xl pt-[2px]" />
              {allMessages?.length > 0 && <>
                <div className="absolute top-0 right-0 bg-red-600 size-2 rounded-full" />
                <div className="absolute top-0 right-0 bg-red-600 size-2 rounded-full animate-ping" />
              </>}
            </div>
          </ActionTooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" 
        className="dark:bg-zinc-800 bg-zinc-200 w-[350px] sm:w-[460px] h-fit rounded-xl border-zinc-500 border-[1px] border-solid">
          <div className="space-y-2 py-3 relative h-full">
            <div className="flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faInbox} size="xl" className="text-zinc-400" />
                <p className="font-bold dark:text-zinc-400 text-zinc-700">Inbox</p>
              </div>
              <div className="flex gap-2 items-center relative">
                <CheckCheck onClick={deleteAll} className="dark:bg-zinc-900 bg-zinc-100 p-2 size-8 rounded-md hover:bg-opacity-75 cursor-pointer hover:text-amber-500"/>
                <Mail className="bg-zinc-100 dark:bg-zinc-900 p-2 size-8 rounded-md cursor-pointer" />
                {allMessages?.length > 0  && <div className="size-4 bg-red-600 flex items-center justify-center text-[11px] rounded-full absolute right-0 top-0">{allMessages?.length}</div>}
              </div>
            </div>
            <div className="flex gap-4 items-baseline px-3 h-9">
              <button 
                className={`font-semibold border-b-2 border-solid h-full duration-300 ${isActive === "forYou" ? "text-black dark:text-white border-amber-500" : "text-zinc-400"}`}
                onClick={() => setIsActive("forYou")}
              >
                For You
              </button>
              <button 
                className={`font-semibold border-b-2 border-solid h-full duration-300 ${isActive === "unread" ? "text-black dark:text-white border-amber-500" : "text-zinc-400"}`}
                onClick={() => setIsActive("unread")}
              >
                Unread
              </button>
            </div>
            <Separator className="bg-zinc-500 absolute top-20" />

            {isActive === "forYou" && <ForYouMessages inboxMessages={inboxMessages}/>}
            {isActive === "unread" && 
            <UnreadMessages 
              deleteAllInboxMsg={deleteAllInboxMsg}
              updateDeleteAllInboxMsg={updateDeleteAllInboxMsg}
              updateAllMessages={udpateAllMessages}
              allMessages={allMessages}
            />}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <ActionTooltip side="top" label="Help">
        <div>
          <FontAwesomeIcon
            onClick={() => router.push("https://github.com/AVN1SH/syncro")}
            icon={faQuestionCircle} className="text-zinc-400 dark:hover:text-white hover:text-black duration-150 cursor-pointer text-xl md:text-2xl pt-[2px]" />
        </div>
      </ActionTooltip>
    </div>
  )
}

export default Inbox