"use client"
import { Menu } from 'lucide-react'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet"
import { Button } from './ui/button'
import { PlainUserWithFriendWithUser } from '@/types'
import TransferPrimary from './windows/TransferPrimary'

interface Props {
  plainUserData : PlainUserWithFriendWithUser;
  userId : string;
}

const TransferNavToggle = ({
  plainUserData,
  userId
}: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
      <button className="fixed left-[62px] top-3 md:hidden z-50 group">
          <Menu className="group-hover:text-amber-500 duration-300" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 w-fit">
        <div className="flex h-full w-[250px] z-10 flex-col dark:bg-[#2b2d31] bg-zinc-100 shadow-[0px_0px_10px_rgba(0,0,0,0.4)] overflow-hidden">
        <TransferPrimary 
          plainUserData={plainUserData}
          userId={userId}
        />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default TransferNavToggle