"use client";

import { useSocket } from "../providers/SocketProvider";
import { Badge } from "./badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if(!isConnected) {
    return (
      <div>
        <Badge variant="outline" className="bg-yellow-600 text-white border-none init:hidden md:block">
          Fallback
        </Badge>
        <div className="size-2 rounded-full bg-yellow-600 md:hidden" />
      </div>
    )
  }

  return (
    <div>
      <Badge variant="outline" className="bg-emerald-600 text-white border-none init:hidden md:block">
        Live
      </Badge>
      <div className="size-2 rounded-full bg-emerald-600 md:hidden" />
    </div>
  )
}