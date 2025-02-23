import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const onlineUsers = new Map();
const socketToUser = new Map();
const activePageUsers = new Map<string, Set<string>>();

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    
    io.on("connection", (socket) => {
      socket.on("online-user", (userId : string) => {
        socketToUser.set(socket.id, userId);
        if(onlineUsers.has(userId)) {
          onlineUsers.set(userId, onlineUsers.get(userId) + 1);
        } else {
          onlineUsers.set(userId, 1);
        }
        io.emit("online-user", Array.from(onlineUsers.keys()));
      });

      socket.on("disconnect", () => {
        const userId = socketToUser.get(socket.id);

        if(userId) {
          if(onlineUsers.get(userId) > 1) {
            onlineUsers.set(userId, onlineUsers.get(userId) -1);
          } else {
            onlineUsers.delete(userId);
          }
          socketToUser.delete(socket.id);
        }
        io.emit("online-user", Array.from(onlineUsers.keys()));
      });

      socket.on("joinPage", ({ friendId, userId }) => {
        const pageKey = `page:${friendId}`;
        socket.join(pageKey);

        socket.data.userId = userId;

        if(!activePageUsers.has(pageKey)) {
          activePageUsers.set(pageKey, new Set());
        }
        activePageUsers.get(pageKey)?.add(userId);

        io.to(pageKey).emit("activePageUsers", Array.from(activePageUsers.get(pageKey)!));
      });

      socket.on("leavePage", ({ friendId, userId }) => {
        const pageKey = `page:${friendId}`;
        socket.leave(pageKey);

        if(activePageUsers.has(pageKey)) {
          activePageUsers.get(pageKey)?.delete(userId);
          io.to(pageKey).emit("activePageUsers", Array.from(activePageUsers.get(pageKey)!));
        }
      });

      // socket.on("disconnect", () => {
      //   console.log("disconnect\n\n\n")
      //   const pageKey = Array.from(socket.rooms);

      //   pageKey.forEach((key) => {
      //     if(key.startsWith("page:")) {
      //       const userId = socket.data.userId;

      //       if(userId) {
      //         activePageUsers.get(key)?.delete(userId);
      //         io.to(key).emit("activePageUsers", Array.from(activePageUsers.get(key)!))
      //       }
      //     }
      //   })
      // });

    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;