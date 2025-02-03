import qs from "query-string";
import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/SocketProvider";
import { use } from "react";
import { MessageWithMemberWithUser } from "@/types";

interface Props {
  queryKey : string;
  apiUrl : string;
  paramKey : "threadId" | "conversationId";
  paramValue ?: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
} : Props) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: undefined
  });

  const plainData = {
    ...data,
    data : data?.pages.map((items) => ({
    ...items,
    items: items.items.map((msg : MessageWithMemberWithUser) => ({
      ...msg,
      _id: msg._id.toString(),
      member: {
        ...msg.member,
        _id: msg.member._id.toString(),
        user: {
          ...msg.member.user,
          _id: msg.member.user._id.toString()
        }
      }
    }))
  }))}

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}