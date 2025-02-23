"use client"
import { Menu } from 'lucide-react'
import React from 'react'

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet"
import { Button } from './ui/button'
import NavigationSidebar from './navigation/NavigationSidebar'
import Primary from './windows/Primary'
import ChatPrimary from './windows/ChatPrimary'
import { PlainUserWithFriendWithUser, SessionUser } from '@/types'

interface Props {
  plainUserData : PlainUserWithFriendWithUser;
  user : SessionUser;
  acceptedFriends : boolean;
  isRequestingUser : boolean;
  isRequestedUser : boolean;
}

const ChatNavToggle = ({
  plainUserData, 
  user, 
  acceptedFriends, 
  isRequestingUser, 
  isRequestedUser
}: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed left-[62px] top-1 md:hidden z-50">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 w-fit">
        <div className="flex h-full w-[250px] z-10 flex-col dark:bg-[#2b2d31] bg-zinc-100 shadow-[0px_0px_10px_rgba(0,0,0,0.4)] overflow-hidden">
          <ChatPrimary 
            plainUserData={plainUserData}
            user={user}
            acceptedFriends={acceptedFriends}
            isRequestedUser={isRequestedUser}
            isRequestingUser={isRequestingUser}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ChatNavToggle
