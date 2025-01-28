import ActionTooltip from "@/components/action-tooltip"
import Single from "@/components/skeletons/Single"
import { Separator } from "@/components/ui/separator"
import { faBolt, faCommentDots, faCommentSms, faFile, faHandshakeAngle, faHashtag, faIdBadge, faMessage, faMicrophone, faSadCry, faShield, faShieldDog, faSmile, faVideo, faWifi, faWifi3 } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Hash, Plus } from "lucide-react"
import PrimaryNav from "../navigation/PrimaryNav"
import { redirect, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Banner from "@/components/connections/Banner"
import PlusIconAction from "../models/PlusIconAction"
import { currentUser } from "@/lib/currentUser"
import ConnectionModel, { Connection } from "@/model/connection.model"
import ThreadModel, { Thread } from "@/model/thread.model"
import MemberModel, { Member } from "@/model/member.model"
import PrimaryWindowHeader from "../connections/PrimaryWindowHeader"
import StoreProvider from "@/store/StoreProvider"
import { ConnectionThreadMemberUser, ConnectionWithMembersWithUsers, DBMember, DBThread, MemberWithUser } from "@/types"
import { serializeData } from "@/lib/serialized"
import { ScrollArea } from "../ui/scroll-area"
import ConnectionSearch from "../connections/ConnectionSearch"
import ConnectionSection from "../connections/ConnectionSection"
import ConnectionThread from "../connections/ConnectionThread"
import ConnectionMember from "../connections/ConnectionMember"

interface Props {
  connectionId : string;
}

const iconMap = {
  "text" : <FontAwesomeIcon icon={faHashtag} className="mr-2 h-4 w-4" />,
  "voice" : <FontAwesomeIcon icon={faMicrophone} className="mr-2 h-4 w-4" />,
  "video" : <FontAwesomeIcon icon={faVideo} className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  "admin" : <FontAwesomeIcon icon={faShieldDog} className="h-4 w-4 mr-2 text-rose-500" />,
  "moderator" : <FontAwesomeIcon icon={faShield} className="h-4 w-4 mr-2 text-yellow-500" />,
  "guest" : null
}

const Primary = async ({connectionId} : Props) => {

  const user = await currentUser();

  if(!user) {
    return redirect("/sign-in");
  }

  // await MemberModel.create({
  //   role : "admin",
  //   user : user._id,
  //   connection : connectionId,
  // })

  
  const connection : ConnectionThreadMemberUser | null = serializeData(await ConnectionModel.findById(connectionId)
  .populate({
    path : "threads",
    options : {sort : {createdAt : "asc"}}
  })
  .populate({
    path : "members",
    options : {sort : {role : "asc"}},
    populate: {
      path: "user",
      select: "name email imageUrl",
    }
  }).lean() as ConnectionThreadMemberUser | null);

  const textThreads = connection?.threads.filter((thread : Thread) => thread.type === "text");
  const voiceThreads = connection?.threads.filter((thread : Thread) => thread.type === "voice");

  const videoThreads = connection?.threads.filter((thread : Thread) => thread.type === "video");

  const members = connection?.members.filter((member : MemberWithUser) => member.user._id !== user?._id);

  if(!connection) {
    return redirect("/connections"); 
  }

  const role = connection?.members.find((member : MemberWithUser) => String(member.user._id) === user?._id)?.role;

  // const url = usePathname();
  // const [activeUrl, setActiveUrl] = useState(url);
  return (
    <div className="">
      <StoreProvider>
        <PrimaryWindowHeader 
          connectionName={connection.name}
          role={role}
          inviteCode={connection.inviteCode}
          connectionId={connectionId}
          profilePhotoUrl={connection.profilePhotoUrl}
          connectionMembers={connection.members}
          connectionUserId={connection.user}
        />
      </StoreProvider>
      <Banner />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ConnectionSearch 
            data={[
              {
                label : "Text Threads",
                type : "thread",
                data : textThreads?.map((thread : DBThread) => ({
                  id : thread._id,
                  name : thread.name,
                  icon : iconMap[thread.type]
                }))
              },
              {
                label : "Voice Threads",
                type : "thread",
                data : voiceThreads?.map((thread : DBThread) => ({
                  id : thread._id,
                  name : thread.name,
                  icon : iconMap[thread.type]
                }))
              },
              {
                label : "Video Threads",
                type : "thread",
                data : videoThreads?.map((thread : DBThread) => ({
                  id : thread._id,
                  name : thread.name,
                  icon : iconMap[thread.type]
                }))
              },
              {
                label : "Members",
                type : "member",
                data : members?.map((member : MemberWithUser) => ({
                  id : member._id,
                  name : member.user.name,
                  icon : roleIconMap[member.role]
                }))
              }
            ]}
          />
        </div>
      </ScrollArea>
      
      {/* <PrimaryNav data={[
        {icon: faHandshakeAngle, label: "Friends"},
        {icon: faIdBadge, label : "By Username"}
      ]}/> */}
      
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>

      {!!textThreads?.length && (
        <StoreProvider>
          <div className="mt-2">
            <ConnectionSection 
              sectionType="threads"
              threadType="text"
              role={role}
              label="Text Threads"
            />
          </div>
          {textThreads?.map((thread) => (
            <ConnectionThread 
              key={String(thread._id)}
              thread={thread}
              connection={connection}
              role={role}
            />
          ))}
        </StoreProvider>
      )}
      {!!voiceThreads?.length && (
        <StoreProvider>
          <div className="mt-2">
            <ConnectionSection 
              sectionType="threads"
              threadType="voice"
              role={role}
              label="Voice Threads"
            />
          </div>
          {voiceThreads?.map((thread) => (
            <ConnectionThread 
              key={String(thread._id)}
              thread={thread}
              connection={connection}
              role={role}
            />
          ))}
        </StoreProvider>
      )}
      {!!videoThreads?.length && (
        <StoreProvider>
          <div className="mt-2">
            <ConnectionSection 
              sectionType="threads"
              threadType="video"
              role={role}
              label="Video Threads"
            />
          </div>
          {videoThreads?.map((thread) => (
            <ConnectionThread 
              key={String(thread._id)}
              thread={thread}
              connection={connection}
              role={role}
            />
          ))}
        </StoreProvider>
      )}
      {!!members?.length && (
        <StoreProvider>
          <div className="mt-2">
            <ConnectionSection 
              sectionType="members"
              role={role}
              label="Members"
              connection={connection}
            />
          </div>
          {members?.map((member) => (
            <ConnectionMember 
              key={String(member._id)}
              member={member}
              connection={connection}
            />
          ))}
        </StoreProvider>
      )}

      <div>
        {/* {activeUrl === "/chat" && <PlusIconAction name="Direct Messages" label="Create new DM"/>} */}
        {/* <PlusIconAction name="Text Threads" label="New thread"/>
        <PlusIconAction name="Voice Threads" label="New thread"/> */}
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
