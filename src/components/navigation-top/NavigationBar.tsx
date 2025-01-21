"use client"
import { faComments, faRightLeft, faServer, faSync } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import ActionTooltip from "../action-tooltip"
import { usePathname, useRouter } from "next/navigation"
import UserAvatar from "../UserAvatar"
import { ModeToggle } from "../themeToggle"
import { Separator } from "../ui/separator"

const NavigationBar = () => {

  const [toRotate, setToRotate] = useState(false);
  const url = usePathname();
  const [active, setActive] = useState(url);
  const router = useRouter();

  return (
    <div className="size-full flex items-center justify-between">
      <div className="relative overflow-hidden flex w-full h-full">
        <div className="absolute pl-3 py-1">
          <ActionTooltip label="See Features" side="right">
            <FontAwesomeIcon 
              icon={faSync} 
              className={`${toRotate ? "rotate-[180deg]" :"rotate-0"} size-[20px] duration-300 bg-yellow-500 p-2 rounded-full hover:cursor-pointer hover:bg-yellow-600 absolute z-10`} 
              onClick={() => setToRotate(!toRotate)} 
            />
          </ActionTooltip>
        </div>
        <div className="flex items-center relative overflow-hidden w-full h-full left-[28px] font-semibold dark:text-zinc-400 text-zinc-600">
          <h1 className={`text-xl font-bold absolute ${!toRotate ? "left-[-120px]" : "left-[32px]"} duration-300`}>SyncRo</h1>
          <button 
            className={`absolute ${toRotate ? "left-[-120px]" : "left-[20px]"} duration-300 h-full group w-[100px]`}
            onClick={() => {router.push("/chat"); setActive("/chat")}}
          >
            <span className="flex gap-2 items-baseline justify-center">
              <FontAwesomeIcon 
                icon={faComments} 
                className={`duration-100  ${active.includes("/chat") ? "text-2xl text-yellow-500 hover:placeholder-opacity-90" : "group-hover:text-2xl group-hover:text-yellow-500 text-sm"}`}
              />
              <div className={`${active === "/chat" 
                ? "text-zinc-600 dark:text-zinc-300 text-sm opacity-90" 
                : "group-hover:text-zinc-600 dark:group-hover:text-zinc-300 group-hover:text-sm"} duration-100`}>Chat</div>
            </span>
          </button>

          <button className={`absolute ${toRotate ? "left-[-120px]" : "left-[120px]"} duration-300 h-full group w-[150px]`}
            onClick={() => {router.push("/connections"); setActive("/connections")}}
          >
            <span className="flex gap-2 items-baseline justify-center">
              <FontAwesomeIcon 
                icon={faServer} 
                className={`duration-100  ${active.includes("/connections") ? "text-2xl text-yellow-500 hover:placeholder-opacity-90" : "group-hover:text-2xl group-hover:text-yellow-500 text-sm"}`}
              />
              <div className={`${active === "/connections" 
                ? "text-zinc-600 dark:text-zinc-300 text-sm opacity-90" 
                : "group-hover:text-zinc-600 dark:group-hover:text-zinc-300 group-hover:text-sm"} duration-100`}>Connections</div>
            </span>
          </button>

          <button className={`absolute ${toRotate ? "left-[-120px]" : "left-[280px]"} duration-300 h-full group w-[150px]`}
            onClick={() => {router.push("/transfer"); setActive("/transfer")}}
          >
            <span className="flex gap-2 items-baseline justify-center">
              <FontAwesomeIcon 
                icon={faRightLeft} 
                className={`duration-100  ${active.includes("/transfer") ? "text-2xl text-yellow-500 hover:placeholder-opacity-90" : "group-hover:text-2xl group-hover:text-yellow-500 text-sm"}`}
              />
              <div className={`${active === "/transfer" 
                ? "text-zinc-600 dark:text-zinc-300 text-sm opacity-90" 
                : "group-hover:text-zinc-600 dark:group-hover:text-zinc-300 group-hover:text-sm"} duration-100`}>File Transfer</div>
            </span>
          </button>
        </div>
      </div>
      <div className="flex">
        <ModeToggle />
        <Separator className="bg-zinc-600 -rotate-90 w-6 h-[1px] mt-5 rounded-full" />
        <div className="overflow-hidden p-2 h-[40px]">
          <ActionTooltip label="Profile" side="left">
            <UserAvatar  className="!h-7 !w-7 cursor-pointer hover:opacity-80 transition-[2s]"/>
          </ActionTooltip>
        </div>
      </div>
    </div>

  )
}

export default NavigationBar
