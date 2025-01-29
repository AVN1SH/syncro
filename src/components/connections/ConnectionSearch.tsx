"use client"
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mongoose from 'mongoose';
import React, { useEffect, useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface Props {
  data : {
    label : string;
    type : "thread" | "member";
    data : {
      icon : React.ReactNode;
      name : string;
      id : mongoose.Schema.Types.ObjectId;
    }[] | undefined
  }[]
}

const ConnectionSearch = ({
  data
} : Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({ id, type } : {id: string, type : "thread" | "member"}) => {
    setOpen(false);

    if(type === "member") {
      return router.push(`/connections/${params?.id}/conversations/${id}`)
    }

    if(type === "thread") {
      return router.push(`/connections/${params?.id}/threads/${id}`)
    }
  }

  return (
    <div>
      <button 
        onClick={() => {console.log(data); setOpen(true)}}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
        <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border-zinc-900 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span>Ctrl/CMD</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search connections..." />
        <CommandList>
          <CommandEmpty>
            No Results Found
          </CommandEmpty>
          {data.map(({ label, type, data }) => {
            if(!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem 
                      key={String(id)} 
                      className="cursor-pointer"
                      onSelect={() => onClick({ 
                        id : String(id),
                        type 
                      })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </div>
  )
}

export default ConnectionSearch
