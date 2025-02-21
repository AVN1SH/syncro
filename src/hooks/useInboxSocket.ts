"use client"
import { useSocket } from "@/components/providers/SocketProvider";
import { PlainInboxWithUser } from "@/types";
import { useEffect, useState } from "react";

type Props = {
  inboxKey : string;
}

export const useInboxSocket = ({
  inboxKey,
} : Props) => {
  const { socket } = useSocket();
  const [newInboxMsg, setNewInboxMsg] = useState<PlainInboxWithUser>();

  useEffect(() => {
    if(!socket) return;
    socket.on(inboxKey, (inboxMessage : PlainInboxWithUser) => {
      setNewInboxMsg(inboxMessage);
    });

    return () => {
      socket.off(inboxKey);
    }
  }, [socket, inboxKey ]);

  return { newInboxMsg }
}