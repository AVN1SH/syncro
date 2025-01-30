import Contacts from "@/components/friends/Contacts"
import { Separator } from "@/components/ui/separator"
import { faHandshakeAngle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react";

interface Props {
  active : (data : string) => void;
}

const FriendsTopNav = ({active} : Props) => {
  const [current, setCurrent] = useState("online");
  return (
    <div className="flex gap-2">
      <div className="flex gap-2 pl-4 items-center font-thin">
        <FontAwesomeIcon icon={faHandshakeAngle} size="xl" />
        <span className="font-semibold">
          <span className="text-yellow-500 font-bold text-lg">F</span>
          riends
        </span>
      </div>
      <Separator className="mx-2 h-[calc(100%-20px)] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[2px] my-auto"/>

      <div className="flex gap-5 items-center text-zinc-300">
        <button 
          className={`${current === "online" && "bg-zinc-600 text-white"} px-2 py-[1px] rounded hover:bg-zinc-700 duration-150`}
          onClick={() => {active("online"); setCurrent("online")}}
        >
          Online
        </button>
        <button 
          className={`${current === "contact" && "bg-zinc-600 text-white"} px-2 py-[1px] rounded hover:bg-zinc-700 duration-150`}
          onClick={() => {active("contact"); setCurrent("contact")}}
        >Contact</button>
        <button 
          className={`${current === "pending" && "bg-zinc-600 text-white"} px-2 py-[1px] rounded hover:bg-zinc-700 duration-150`}
          onClick={() => {active("pending"); setCurrent("pending")}}
        >Pending</button>
        <button 
          className={`${current === "blocked" && "bg-zinc-600 text-white"} px-2 py-[1px] rounded hover:bg-zinc-700 duration-150`}
          onClick={() => {active("blocked"); setCurrent("blocked")}}
        >Blocked</button>
        <button 
          className={`${current === "all" && "bg-zinc-600 text-white"} px-2 py-[1px] rounded hover:bg-zinc-700 duration-150`}
          onClick={() => {active("all"); setCurrent("all")}}
        >All</button>
      </div>
    </div>
  )
}

export default FriendsTopNav
