"use client"

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils"
import ActionTooltip from '../action-tooltip';

interface Props {
  id : string;
  imageUrl : string;
  name : string;
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
        ${params?.connectionId !== id && "group-hover:h-[20px]"}
        ${params?.connectionId === id ? "h-[36px]" : "h-[8px]"}
        `} />

        <div
          className={`relative group flex mx-2 h-[46px] rounded-[23px] group-hover:rounded-[16px] transition-all overflow-hidden
          ${params?.connectionId === id && "bg-primary/10 text-primary rounded-[16px]"}
          `}
        >
          <img src={imageUrl} className="object-cover" alt="Channel" />
          
        </div>
      </button>
    </ActionTooltip>
  )
}

export default SideNavigationItems
