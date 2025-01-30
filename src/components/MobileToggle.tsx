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

interface Props {
  connectionId : string;
}

const MobileToggle = ({connectionId} : Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
          <Primary connectionId={connectionId} />
        </div>
        <Primary 
          connectionId={connectionId}
        />
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle
