import { Separator } from "@/components/ui/separator"
import { Crown, Hash, Mic, Skull, Video } from "lucide-react"
import { redirect } from "next/navigation"
import Banner from "@/components/connections/Banner"
import { currentUser } from "@/lib/currentUser"
import ConnectionModel from "@/model/connection.model"
import { Thread } from "@/model/thread.model"
import PrimaryWindowHeader from "../connections/PrimaryWindowHeader"
import StoreProvider from "@/store/StoreProvider"
import { ConnectionThreadMemberUser, DBFriend, DBThread, MemberWithUser } from "@/types"
import { serializeData } from "@/lib/serialized"
import { ScrollArea } from "../ui/scroll-area"
import ConnectionSearch from "../connections/ConnectionSearch"
import ConnectionSection from "../connections/ConnectionSection"
import ConnectionThread from "../connections/ConnectionThread"
import ConnectionMember from "../connections/ConnectionMember"
import FriendModel from "@/model/friend.model"
import mongoose from "mongoose"

interface Props {
  connectionId : string;
}

const iconMap = {
  "text" : <Hash className="mr-2 h-4 w-4" />,
  "voice" : <Mic className="mr-2 h-4 w-4" />,
  "video" : <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  "admin" : <Crown className="h-4 w-4 mr-2 text-rose-500" />,
  "moderator" : <Skull className="h-4 w-4 mr-2 text-yellow-500" />,
  "guest" : null
}

const Primary = async ({connectionId} : Props) => {

  const user = await currentUser();

  if(!user) {
    return redirect("/sign-in");
  }
  
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
      populate : {
        path : "friends"
      }
    }
  }).lean() as ConnectionThreadMemberUser | null);

  const textThreads = connection?.threads.filter((thread : Thread) => thread.type === "text");
  const voiceThreads = connection?.threads.filter((thread : Thread) => thread.type === "voice");

  const videoThreads = connection?.threads.filter((thread : Thread) => thread.type === "video");

  const members = connection?.members.filter((member : MemberWithUser) => String(member.user._id) !== user?._id);

  const userIds = members?.map((member : any) => String(member.user._id));

  const friends : DBFriend[] = await FriendModel.aggregate([
    {
      $match : {
        $or : [
          {
            requestingUser : new mongoose.Types.ObjectId(user._id),
            requestedUser : {$in : userIds?.map(id => new mongoose.Types.ObjectId(id))}
          },
          {
            requestingUser : {$in : userIds?.map(id => new mongoose.Types.ObjectId(id))},
            requestedUser : new mongoose.Types.ObjectId(user._id)
          }
        ]
      }
    }
  ]);

  if(!connection) {
    return redirect("/connections"); 
  }

  const role = connection?.members.find((member : MemberWithUser) => String(member.user._id) === user?._id)?.role;

  return (
    <div className="flex flex-col h-full">
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
        <Banner 
          connectionId={connection._id}
          connectionBannerPhotoUrl={connection.bannerPhotoUrl}
          role={role}
        />
      </StoreProvider>
      <ScrollArea className="h-[50px] px-3">
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
      
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[calc(100%-10px)] mx-auto my-2"/>

      <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
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
                  friendStatus={(friends.find(friend => {
                    const requestingUser = String(friend.requestingUser);
                    const requestedUser = String(friend.requestedUser);
                    const memberUserId = String(member.user._id);

                    if(requestedUser === memberUserId || requestingUser === memberUserId) {
                      return friend;
                    }
                  }))?.status || "none"}               
                />
              ))}
            </StoreProvider>
          )}
      </div>
    </div>
  )
}
export default Primary