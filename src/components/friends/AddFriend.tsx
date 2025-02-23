"use client"
import React, { useState } from 'react'
import { Separator } from '../ui/separator'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const AddFriend = () => {
  const [error, setError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/friend-request", {
        username : inputValue
      })
  
      if(response) {
        setIsLoading(false);
        router.refresh();
        setError('');
        setInputValue('');
      }
    } catch (error : any) {
      setError(error.response.data.message);
      console.log(error);
      setIsLoading(false);
    }
  }
  return (
    <div className="flex-1 p-4">
      <div className="flex flex-col gap-y-1">
        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">ADD FRIEND</p>
        <p className="text-zinc-700 dark:text-zinc-300">You can add friends by using it's SyncRo username.</p>
      </div>
      <form className="my-8">
        <div className={`dark:bg-[#1e1f22] bg-zinc-200 flex justify-between items-center h-14 px-3 rounded-lg border-2 focus-within:border-amber-500 focus-within:border-solid`}>
          <input 
            className="focus:outline-none bg-transparent flex-1 h-full"
            placeholder="Type SyncRo username here..."
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="bg-amber-500 px-3 py-1 rounded duration-300"
            type="submit"
            onClick={handleOnSubmit}
          >{isLoading ? <span className='flex gap-1'>Sending <Loader2 className="animate-spin" /></span> : "Send Request"}</button>
        </div>
        {error && <p className="text-xs text-rose-500 font-semibold mt-1 ml-2">{error}</p>}
      </form>
      <Separator className="dark:bg-zinc-700 bg-zinc-200" />
      <img src="/images/singleBoy.svg" className="w-[600px] self-center mx-auto drop-shadow-md" />
    </div>
  )
}

export default AddFriend