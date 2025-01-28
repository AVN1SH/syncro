"use client";
import { cn } from '@/lib/utils';
import { DBConnection, DBMember, DBThread } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import ActionTooltip from '../action-tooltip';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { ConnectionType, onOpen } from '@/features/modelSlice';

interface Props {
  thread : DBThread;
  connection : DBConnection;
  role ?: DBMember["role"];
}

const iconMap = {
  "text" : Hash,
  "voice" : Mic,
  "video" : Video,
}

const ConnectionThread = ({ thread, connection, role } : Props) => {
  const params = useParams();
  const router = useRouter();
  
  const dispatch = useDispatch();

  const Icon = iconMap[thread.type];

  const onClick = () => {
    router.push(`/connections/${connection._id}/threads/${thread._id}`)
  }

  const onAction = (e : React.MouseEvent, action : ConnectionType) => {
    e.stopPropagation();
    dispatch(onOpen({type : action, data : {
      thread,
      connectionId : connection._id
    }}))
  }

  return (
    <div className="mx-3 space-y-[2px]">
      <button 
        onClick={onClick}
        className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.threadId === String(thread._id) ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent")}
      >
        <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.threadId === String(thread._id) && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
          {thread.name}
        </p>
        {thread.name !== "general" && role !== "guest" && (
          <div className="ml-auto flex item-center gap-x-2">
            <ActionTooltip label="Edit">
              <Edit
                onClick={(e) => onAction(e, "editThread")} 
                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              <Trash 
                onClick={(e) => onAction(e, "deleteThread")}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-rose-500 transition" />
            </ActionTooltip>
          </div>
        )}
        {thread.name === "general" && (
          <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </button>
    </div>
  )
}

export default ConnectionThread
