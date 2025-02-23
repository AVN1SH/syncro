"use client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

type SocketContextType = {
  socket : any | null;
  isConnected : boolean;
  onlineUsers : string[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers:[]
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({children} : {children : React.ReactNode}) => {
  const [socket, setSocket] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data : session, status } = useSession();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if(status !== "authenticated" || !session?.user._id) return;

    const socketInstance = new (io as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      autoConnect : true,
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      socketInstance.emit("online-user", session?.user._id);
    });
    
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    
    socketInstance.on("online-user", (users: string[]) => {
      setOnlineUsers(users);
    })

    setSocket(socketInstance);

    return () => {
      socketInstance.off("online-user");
      socketInstance.disconnect();
    }

  }, [status, session]);

  return (
    <SocketContext.Provider value={{socket, isConnected, onlineUsers}}>
      {children}
    </SocketContext.Provider>
  )
}