"use client"
import { Separator } from "@/components/ui/separator"
import { faHandshakeAngle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useDispatch, useSelector } from "react-redux"
import { onChange } from "@/features/chatNavigateSlice"
import { RootState } from "@/store/store"

const FriendsTopNav = () => {
  const dispatch = useDispatch();
  const activeName = useSelector((state : RootState) => state.createChatNavSlice.activeName)

  return (
    <div className="flex gap-2 overflow-x-auto ml-10 md:ml-0 scrollbar scrollbar-horizontal px-2 sm:rounded-none">
      <div className="flex gap-2 pl-0 md:pl-4 items-center font-thin">
        <FontAwesomeIcon icon={faHandshakeAngle} size="xl" />
        <span className="font-semibold">
          <span className="text-yellow-500 font-bold text-lg">F</span>
          riends
        </span>
      </div>
      <Separator className="mx-2 h-[calc(100%-20px)] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[2px] my-auto"/>

      <div className="flex gap-5 items-center dark:text-zinc-300 text-zinc-700">
        <button 
          className={`${activeName === "online" && "dark:bg-zinc-600 bg-zinc-300 text-black dark:text-white"} px-2 py-[1px] rounded dark:hover:bg-zinc-700 hover:bg-zinc-200 duration-150`}
          onClick={() => dispatch(onChange("online"))}
        >
          Online
        </button>
        <button 
          className={`${activeName === "pending" && "dark:bg-zinc-600 bg-zinc-300 text-black dark:text-white"} px-2 py-[1px] rounded dark:hover:bg-zinc-700 hover:bg-zinc-200 duration-150`}
          onClick={() => dispatch(onChange("pending"))}
        >Pending</button>
        <button 
          className={`${activeName === "all" && "dark:bg-zinc-600 bg-zinc-300 text-black dark:text-white"} px-2 py-[1px] rounded dark:hover:bg-zinc-700 hover:bg-zinc-200 duration-150`}
          onClick={() => dispatch(onChange("all"))}
        >All</button>
        <button 
          className={`${activeName === "add" ? "bg-transparent text-emerald-500" : "text-white"} px-2 py-[1px] rounded hover:bg-emerald-700 duration-150 bg-emerald-600 text-nowrap`}
          onClick={() => dispatch(onChange("add"))}
        >Add Friends</button>
      </div>
    </div>
  )
}

export default FriendsTopNav