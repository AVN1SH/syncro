"use client";
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { SmilePlus } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useTheme } from 'next-themes';

interface props {
  onChange : (value : string) => void;
}

const EmojiPicker = ({onChange} : props) => {
  const {resolvedTheme} = useTheme();
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <SmilePlus
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition "
          />
        </PopoverTrigger>
        <PopoverContent 
          side="right" 
          sideOffset={40}
          className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
        >
          <Picker 
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={(emoji : any) => onChange(emoji.native)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default EmojiPicker