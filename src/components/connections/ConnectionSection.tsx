"use client";

import { ConnectionThreadMemberUser, DBMember, DBThread } from '@/types';
import React from 'react'
import PlusIconAction from '../models/PlusIconAction';
import ActionTooltip from '../action-tooltip';
import { Plus, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { onOpen } from '@/features/modelSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

interface Props {
  label : string;
  role ?: DBMember["role"];
  sectionType : "threads" | "members";
  threadType ?: DBThread["type"];
  connection ?: ConnectionThreadMemberUser;
}

const ConnectionSection = ({
  label,
  role,
  sectionType,
  threadType,
  connection
}: Props) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between p-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== "guest" && sectionType === "threads" && (
        <ActionTooltip label="Create Thread">
          <button 
            onClick={() => dispatch(onOpen({type : "createThread", data : {
              threadType
            }}))}
            className="hover:text-zinc-700 text-yellow-500 dark:text-yellow-400 dark:hover:text-zinc-300 transition"
          >
            <Plus size={16} />
          </button>
        </ActionTooltip>
      )}
      {role !== "admin" && sectionType === "members" && (
        <ActionTooltip label="Manage Members">
          <button 
            onClick={() => dispatch(onOpen({
              type : "members", 
              data : {
                connectionId : connection?._id,
                connectionMembers : connection?.members,
                connectionUserId : connection?.user
              }
            }))}
            className="text-zinc-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ConnectionSection