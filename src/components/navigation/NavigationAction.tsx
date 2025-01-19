"use client";
import { Plus } from 'lucide-react';
import ActionTooltip from '@/components/action-tooltip';
import InitialConnection from '../models/InitialConnection';
import { useDispatch } from 'react-redux';
import { onOpen } from '@/features/modelSlice';
// import { useAppDispatch } from '@/hooks/storeHooks';

const NavigationAction = () => {
  const dispatch = useDispatch();

  const handleOnClick = () => {
    dispatch(onOpen({ type : "createConnection"}));
  }
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Create a connection">
        <button
          className="group flex items-center"
          onClick={handleOnClick}
        >
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-yellow-500">
            <Plus className="group-hover:text-white transition text-yellow-500" size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}

export default NavigationAction
