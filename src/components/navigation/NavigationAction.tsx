"use client";
import { Plus } from 'lucide-react';
import ActionTooltip from '@/components/action-tooltip';
import { useDispatch } from 'react-redux';
import { onOpen } from '@/features/modelSlice';
import { usePathname } from 'next/navigation';
import { Separator } from '@radix-ui/react-dropdown-menu';

const NavigationAction = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const handleOnClick = () => {
    dispatch(onOpen({ type : "createConnection"}));
  }
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Create a connection">
        <button
          className={`group relative flex items-center duration-300 ${pathname?.includes("connections") ? "left-0" : "-left-20"}`}
          onClick={handleOnClick}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-yellow-500">
            <Plus className="group-hover:text-white transition text-yellow-500" size={25} />
          </div>
        </button>
      </ActionTooltip>

      <Separator className={`h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto mt-4 ${pathname?.includes("connections") ? "w-10" : "w-0"} transition-all duration-300`} />
    </div>
  )
}

export default NavigationAction