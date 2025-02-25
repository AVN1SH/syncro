"use client"
import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { onChange } from '@/features/chatNavigateSlice';

const AddFriend = () => {
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/friend-request", {
        username : inputValue
      })
  
      if(response) {
        setIsLoading(false);
        toast("Request Send Successfully", {
          description : "Now You can check your friend request in pending friends",
          action: {
            label: "Check",
            onClick: () => {dispatch(onChange("pending"))},
          },
        })
        router.refresh();
        setError('');
        setInputValue('');
      }
    } catch (error : any) {
      setError(error.response.data);
      console.log(error);
      setIsLoading(false);
    }
  }
  return (
    <div className="flex-1 py-4 px-2 md:px-4">
      <div className="flex flex-col gap-y-1">
        <p className="text-sm md:text-lg font-bold text-zinc-800 dark:text-zinc-200">ADD FRIEND</p>
        <p className="text-xs md:text-[16px] text-zinc-700 dark:text-zinc-300">{"You can add friends by using it's SyncRo username."}</p>
      </div>
      <form className="my-8">
        <div className={`dark:bg-[#1e1f22] bg-zinc-200 flex justify-between items-center h-14 px-3 rounded-lg border-2 focus-within:border-amber-500 focus-within:border-solid w-[290px] sm:w-full`}>
          <input 
            className="focus:outline-none bg-transparent flex-1 h-full text-sm md:text-[16px]"
            placeholder="Type SyncRo username here..."
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="bg-amber-500 md:px-3 px-1 py-1 rounded duration-300 w-[100px] md:w-fit"
            type="submit"
            onClick={handleOnSubmit}
          >{isLoading ? <span className='flex gap-1 items-center'>Send <Loader2 className="animate-spin size-4" /></span> : <span>Send <span className="init:hidden md:block">Request</span></span>}</button>
        </div>
        {error && <p className="text-xs text-rose-500 font-semibold mt-1 ml-2">{error}</p>}
      </form>
      <Separator className="dark:bg-zinc-700 bg-zinc-200" />
      <Image alt="single-boy" width={600} height={600} src="/images/singleBoy.svg" className="w-[600px] self-center mx-auto drop-shadow-md" />
    </div>
  )
}

export default AddFriend