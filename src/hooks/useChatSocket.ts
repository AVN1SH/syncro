import { useSocket } from "@/components/providers/SocketProvider";
import { MessageWithMemberWithUser } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type Props = {
  addKey : string;
  updateKey : string;
  queryKey : string;
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey
} : Props) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if(!socket) return;

    socket.on(updateKey, (message : MessageWithMemberWithUser) => {
      queryClient.setQueryData([queryKey], (oldData : any) => {
        if(!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page : any) => {
          return {
            ...page,
            items : page.items.map((item: MessageWithMemberWithUser) => {
              if(String(item._id) === String(message._id)) return message;

              return item;
            })
          }
        });

        return {
          ...oldData,
          pages : newData
        }
      })
    });

    socket.on(addKey, (message : MessageWithMemberWithUser) => {
      queryClient.setQueryData([queryKey], (oldData : any) => {
        if(!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages : [{
              items : [message]
            }]
          }
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          items : [
            message,
            ...newData[0].items,
          ]
        }

        return {
          ...oldData,
          pages : newData
        }
      });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    }
  }, [queryClient, addKey, queryKey, socket, updateKey])
}