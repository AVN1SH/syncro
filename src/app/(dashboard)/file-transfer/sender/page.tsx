import SecondaryWindowHeader from '@/components/chat/SecondaryWindowHeader'
import Sender from '@/components/transfer/Sender'
import React from 'react'

const page = () => {
  return (
    <div className='fixed left-[310px] top-0 right-0 bottom-0'>
      <div className="relative top-0 h-full w-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
        <SecondaryWindowHeader 
          name="Generate Link"
          type="generateLink"
        />
        <div className="absolute left-0 right-0 bottom-0 top-[50px] overflow-hidden wave-container">
          <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-zinc-400 rounded-full animate-float" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-zinc-500 rounded-full animate-float" />
          <div className="absolute top-0 right-40 w-24 h-24 bg-zinc-500 rounded-full animate-float " />
          <div className="absolute left-0 right-1/4 w-32 h-32 bg-zinc-500 rounded-full animate-float" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-white">
          <Sender />
        </div>
      </div>
    </div>
  )
}

export default page
