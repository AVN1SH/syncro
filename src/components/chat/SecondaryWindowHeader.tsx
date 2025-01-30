import { Hash } from 'lucide-react';
import React from 'react'
import MobileToggle from '../MobileToggle';

interface Props {
  connectionId : string;
  name : string;
  imageUrl ?: string;
  type : "thread" | "conversation";
}

const SecondaryWindowHeader = ({
  connectionId,
  name,
  imageUrl,
  type
} : Props) => {
  return (
    <div className="border-solid border-zinc-200 dark:border-zinc-800 border-b-[2px] h-[50px] flex items-center justify-between pl-2">
      <div className="flex items-center font-semibold">
        <MobileToggle 
          connectionId={connectionId}
        />
        {type === "thread" && (
          <Hash className="w-5 h-5 text-zinc-50 dark:text-zinc-400 mr-2" />
        )}
        <p className="font-semibold text-md text-black dark:text-white">
          {name}
        </p>
      </div>
      
    </div>
  )
}

export default SecondaryWindowHeader;
