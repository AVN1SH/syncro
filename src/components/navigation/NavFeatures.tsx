"use client";
import React, { useState } from 'react';
import ActionTooltip from '../action-tooltip';
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftRight, MessagesSquare, RefreshCw, Server } from 'lucide-react';
import { Separator } from '../ui/separator';

const NavFeatures = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [toRotate, setToRotate] = useState(false);

  return (
    <div className={`space-y-2 transition-all duration-500 overflow-hidden relative z-0
    ${toRotate ? "h-[50px] delay-300" : "h-[240px]"}`}>
      <ActionTooltip label={toRotate ? "See Features" : "Hide Features"} side="right">
        <button
          className="group flex items-center"
        >
          <RefreshCw
            className={`${toRotate ? "rotate-[180deg]" :"rotate-0"} duration-300 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full hover:cursor-pointer hover:bg-yellow-600 mx-3 size-[48px] transition-all p-2 `} 
            onClick={() => setToRotate(!toRotate)} 
          />
        </button>
      </ActionTooltip>

      <Separator className={`h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto ${toRotate ? "w-0 delay-0" : "w-10 delay-500"} transition-all duration-300`} />

      <ActionTooltip side="right" align="center" label={"Chat"}>
        <button
          className={`${toRotate 
            ? "top-[10px] scale-50 opacity-0"
            : "top-[66px] scale-100 opacity-100"
          } group overflow-hidden absolute top-[20px] -z-10 transition-all duration-300 delay-300`}
          onClick={() => router.push("/chat")}
        >
          <div className={`flex mx-3 h-[48px] w-[48px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center group-hover:bg-yellow-500
          ${pathname?.includes("chat")
            ? "rounded-[16px] bg-yellow-500"
            : "rounded-[24px] bg-background dark:bg-neutral-700"
          }
          `}>
            <MessagesSquare className={`group-hover:text-white transition text-yellow-500" size={25}
              ${pathname?.includes("chat")
                ? "text-white"
                : "text-yellow-500"
              }
            `}/>
          </div>
        </button>
      </ActionTooltip>

      <ActionTooltip side="right" align="center" label={"Connections"}>
        <button
          className={`${toRotate 
            ? "top-[10px] scale-50 opacity-0"
            : "top-[130px] scale-100 opacity-100"
          } group overflow-hidden absolute -z-10 trasition-all duration-500 delay-300`}
          onClick={() => router.push("/connections")}
        >
          <div className={`flex mx-3 h-[48px] w-[48px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center group-hover:bg-yellow-500
          ${pathname?.includes("connections")
            ? "rounded-[16px] bg-yellow-500"
            : "rounded-[24px] bg-background dark:bg-neutral-700"
          }
          `}>
            <Server className={`group-hover:text-white transition text-yellow-500" size={25}
              ${pathname?.includes("connections")
                ? "text-white"
                : "text-yellow-500"
              }
            `}/>
          </div>
        </button>
      </ActionTooltip>

      <ActionTooltip side="right" align="center" label={"Transfer"}>
        <button
          className={`${toRotate 
            ? "top-[10px] scale-50 opacity-0"
            : "top-[190px] scale-100 opacity-100"
          } group overflow-hidden absolute -z-10 trasition-all duration-700 delay-300`}
          onClick={() => router.push("/file-transfer")}
        >
          <div className={`flex mx-3 h-[48px] w-[48px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center group-hover:bg-yellow-500
          ${pathname?.includes("transfer")
            ? "rounded-[16px] bg-yellow-500"
            : "rounded-[24px] bg-background dark:bg-neutral-700"
          }
          `}>
            <ArrowLeftRight className={`group-hover:text-white transition text-yellow-500" size={25}
              ${pathname?.includes("transfer")
                ? "text-white"
                : "text-yellow-500"
              }
            `}/>
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavFeatures