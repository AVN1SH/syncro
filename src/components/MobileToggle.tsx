import { Menu } from 'lucide-react'
import React from 'react'

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet"
import Primary from './windows/Primary'

interface Props {
  connectionId : string;
}

const MobileToggle = ({connectionId} : Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden group">
          <Menu className="group-hover:text-amber-500 duration-300" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0 w-fit">
        <div className="flex h-full w-[250px] z-10 flex-col dark:bg-[#2b2d31] bg-zinc-100 shadow-[0px_0px_10px_rgba(0,0,0,0.4)]">
          <Primary 
            connectionId={connectionId}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle