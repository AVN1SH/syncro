"use client"

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils"
import ActionTooltip from '../action-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNodes, faCloud, faUser } from '@fortawesome/free-solid-svg-icons';

interface Props {
  id : string;
  imageUrl : string;
  name : string;
  active : boolean;
}

const SideNavigationItems = ({id, imageUrl, name} : Props) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/connections/${id}`);
  }


  return (
    <ActionTooltip 
      side="right"
      align="center"
      label={name}
    >
      <button 
        onClick={onClick}
        className="group relative flex items-center"
      >
        <div className={`
        absolute left-0 bg-primary rounded-r-full transition-all w-[4px]
        ${params?.id !== id && "group-hover:h-[20px]"}
        ${params?.id === id ? "h-[36px]" : "h-[8px]"}
        `} />

        <div
          className={`relative group flex mx-2 h-[46px] rounded-[23px] group-hover:rounded-[16px] transition-all overflow-hidden
          ${params?.connectionId === id && "bg-primary/10 text-primary rounded-[16px]"}
          `}
        >
          { imageUrl 
            ? <img src={imageUrl} className="object-cover" alt="Channel" />
            : <div className="bg-zinc-300 dark:bg-zinc-700 size-[46px] flex items-center justify-center">
                <FontAwesomeIcon icon={faCircleNodes} size="xl" className="text-neutral-500 dark:text-neutral-400"/> 
            </div>
          }
          
        </div>
      </button>
    </ActionTooltip>
  )
}

export default SideNavigationItems
