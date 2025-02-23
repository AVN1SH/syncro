"use client";

import { useSocket } from "../providers/SocketProvider";
import { Badge } from "./badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if(!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Fallback
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Live
    </Badge>
  )
}