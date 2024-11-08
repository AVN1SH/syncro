"use client"
import ActionTooltip from "@/components/action-tooltip"
import Single from "@/components/skeletons/Single"
import { Separator } from "@/components/ui/separator"
import { faBolt, faCommentDots, faCommentSms, faFile, faHandshakeAngle, faIdBadge, faMessage, faSadCry, faSmile, faVideo, faWifi, faWifi3 } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Plus } from "lucide-react"
import PrimaryNav from "../navigation/PrimaryNav"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Banner from "@/app/(dashboard)/connections/Banner"
import PlusIconAction from "../models/PlusIconAction"

const Primary = () => {
  const url = usePathname();
  const [activeUrl, setActiveUrl] = useState(url);
  return (
    <div className="">
      <div className="border-solid border-zinc-900 border-b-[2px] h-[50px] w-full">
        {activeUrl === "/chat" && <div className="relative py-2 text-center h-full w-full">
          <div className="absolute w-full h-full top-0 left-0 -z-10 opacity-10">
            <FontAwesomeIcon icon={faMessage} color="yellow" size="xs" bounce className="absolute top-[20px] left-2"/>
            <FontAwesomeIcon icon={faSmile} spin className="absolute top-1 left-[30px]" />
            <FontAwesomeIcon icon={faSmile} color="yellow" spin className="absolute bottom-1 right-[100px]" />
            <FontAwesomeIcon icon={faMessage} className="absolute top-[19px] right-3 animate-pulse"/>
            <FontAwesomeIcon icon={faSmile} size="xs" className="absolute bottom-3 left-[100px] animate-pulse" />
            <FontAwesomeIcon icon={faCommentSms} color="yellow" size="xs" className="absolute bottom-2 left-[70px]" />
            <FontAwesomeIcon icon={faCommentDots} className="absolute bottom-2 right-[70px] animate-bounce" />
            <FontAwesomeIcon icon={faSadCry} size="xs" className="absolute bottom-1 left-[45px] animate-bounce" />
            <FontAwesomeIcon icon={faFile} color="yellow" size="xs" bounce className="absolute bottom-5 right-[45px]" />
          </div>
          <span className="text-yellow-500 text-2xl font-bold">D</span>
          <span className="font-thin text-xl">irect Chat</span>
        </div>}

        {activeUrl.includes("/connections") && <div className="relative py-2 text-center h-full w-full">
          <div className="absolute w-full h-full top-0 left-0 -z-10 opacity-10">
            <FontAwesomeIcon icon={faBolt} color="yellow" size="xs" bounce className="absolute top-[20px] left-2"/>
            <FontAwesomeIcon icon={faSmile} spin className="absolute top-1 left-[30px]" />
            <FontAwesomeIcon icon={faSmile} color="yellow" spin className="absolute bottom-1 right-[100px]" />
            <FontAwesomeIcon icon={faWifi3} className="absolute top-[19px] right-3 animate-pulse"/>
            <FontAwesomeIcon icon={faSmile} size="xs" className="absolute bottom-3 left-[100px] animate-pulse" />
            <FontAwesomeIcon icon={faCommentSms} color="yellow" size="xs" className="absolute bottom-2 left-[70px]" />
            <FontAwesomeIcon icon={faCommentDots} className="absolute bottom-2 right-[70px] animate-bounce" />
            <FontAwesomeIcon icon={faWifi} size="xs" className="absolute bottom-1 left-[45px] animate-bounce" />
            <FontAwesomeIcon icon={faVideo} color="yellow" size="xs" bounce className="absolute bottom-5 right-[45px]" />
          </div>
          <span className="text-yellow-500 text-2xl font-bold">T</span>
          <span className="font-thin text-xl">hreads</span>
        </div>}
      </div>
      <Banner />
      
      {activeUrl === "/chat" && <PrimaryNav data={[
        {icon: faHandshakeAngle, label: "Friends"},
        {icon: faIdBadge, label : "By Username"}
      ]}/>}

      
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>

      <div>
        {activeUrl === "/chat" && <PlusIconAction name="Direct Messages" label="Create new DM"/>}
        {activeUrl.includes("/connections") && <PlusIconAction name="Text Threads" label="New thread"/>}
        {activeUrl.includes("/connections") && <PlusIconAction name="Voice Threads" label="New thread"/>}
        <div className="p-2 space-y-3">
          {[...Array(8)].map((_, index) => {
            return <Single key={index}/>
          })}
        </div>
      </div>
    </div>
  )
}

export default Primary
