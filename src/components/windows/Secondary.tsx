// import { useEffect, useState } from "react";
import FriendsTopNav from "../chat/FriendsTopNav";
import Contacts from "@/components/friends/Contacts";
import Inbox from "../notifications/Inbox";
// import { usePathname } from "next/navigation";
import SecondaryWindowHeader from "../chat/SecondaryWindowHeader";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import ThreadModel from "@/model/thread.model";
import MemberModel from "@/model/member.model";
import mongoose from "mongoose";
import { DBMember, DBThread, PlainMember } from "@/types";
import ChatInput from "../chat/ChatInput";
import StoreProvider from "@/store/StoreProvider";
import ChatMessages from "../chat/ChatMessages";
import { threadType } from "@/schemas/thread";
import MediaRoom from "../MediaRoom";

interface Props {
  connectionId : string;
  threadName : string;
  threadId ?: string;
  imageUrl ?: string;
  type : "thread" | "conversation";
  member ?: PlainMember;
  memberName ?: string;
  conversationId ?: string;
  threadType ?: DBThread['type'];
  video ?: boolean;
}

const Secondary = async({
    connectionId,
    threadName,
    threadId,
    imageUrl,
    type,
    member,
    memberName,
    conversationId,
    threadType,
    video
  } : Props) => {
  // const [active, setActive] = useState("online");
  // const url = usePathname();
  // const [activeUrl, setActiveUrl] = useState(url);

  // if() redirect("/connections");

  return (
    <div className="flex flex-col h-full">
      {type === "thread" && <SecondaryWindowHeader 
        name = {threadName}
        connectionId={connectionId}
        type={type}
      />}

      {type === "thread" && threadType === "text" && <ChatMessages 
        name={threadName}
        member={member}
        chatId={threadId}
        type="thread"
        apiUrl="/api/messages"
        socketurl="/api/socket/messages"
        socketQuery={{
          threadId : threadId ? threadId : '',
          connectionId : connectionId
        }}
        paramKey="threadId"
        paramValue={threadId}
      />}
      {type === "conversation" && <SecondaryWindowHeader
        imageUrl={imageUrl}
        name={threadName}
        connectionId={connectionId}
        type={type}
      />}
      {video && (
        <MediaRoom
          chatId={conversationId ? conversationId : ''}
          video={true}
          audio={true}
        />
      )}
      {!video && (
        <>
          {type === "conversation" &&<ChatMessages 
            name={memberName}
            member={member}
            chatId={conversationId}
            type="conversation"
            apiUrl="/api/directMessages"
            socketurl="/api/socket/directMessages"
            socketQuery={{
              conversationId : conversationId ? conversationId : ''
            }}
            paramKey="conversationId"
            paramValue={conversationId}
          />}
          <StoreProvider>
            {type === "conversation" &&  <ChatInput 
              name={memberName}
              type="conversation"
              apiUrl="/api/socket/directMessages"
              query={{
                conversationId : conversationId,
              }}
            />}
          </StoreProvider>
        </>
      )}
      
      <StoreProvider>
        {type === "thread" && threadType === "text" && <ChatInput 
          name={threadName}
          type="thread"
          apiUrl="/api/socket/messages"
          query={{
            threadId : threadId,
            connectionId : connectionId
          }}
        />}
        
      </StoreProvider>

      {threadType === "voice" && (
        <MediaRoom 
          chatId={threadId ? threadId : ''}
          video={false}
          audio={true}
        />
      )}
      {threadType === "video" && (
        <MediaRoom 
          chatId={threadId ? threadId : ''}
          video={true}
          audio={true}
        />
      )}
      {/* <div className="border-solid border-zinc-800 border-b-[2px] h-[50px] flex justify-between">
        {activeUrl === "/chat" && <FriendsTopNav active={(data : string) => setActive(data)} />}

        {activeUrl.includes("/connections") && <FriendsTopNav active={(data : string) => setActive(data)} />}

        <Inbox />
      </div> */}

      {/* {active === "contact" && <Contacts />} */}

      {/* {active === "online" && activeUrl.includes("/chat") && <div className="flex flex-col items-center justify-center relative">
        <img src="/images/sadEmoji.svg" 
          className="object-contain w-[200px] h-[200px] repeat-0 mx-auto mt-[100px] drop-shadow-[4px_10px_10px_rgba(172,71,4,1)]"
        />
        <span className="font-semibold mt-4 text-zinc-400 flex gap-2 items-center pt-6 relative overflow-hidden">
          <span>
            You currently have no any friends..
            <span className="text-yellow-500">! </span> 
            Make your friends now. 
          </span>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 rounded text-[16px] duration-150 peer">
            Add Friends
          </button>
          <img src="/images/sadEmoji.svg" 
            className="object-contain w-[40px] h-[40px] repeat-0 absolute right-7 -z-10 bottom-[-15px] peer-hover:bottom-1 duration-300"
          />
        </span>
      </div>} */}

      {/* {activeUrl.includes("/connections") && <div className="flex flex-col items-center justify-center h-screen">
        <img src="/images/hashBackground.svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] object-contain -z-10 opacity-80" />
        <div className="font-semibold mt-4 text-zinc-400 flex flex-col gap-2 items-center pt-6 relative overflow-hidden text-sm">
          <h1 className="text-lg text-zinc-300 font-bold">
            NO THREADS YET
          </h1>
          <div className="flex flex-col gap-0 items-center">
            <p>You don't have access to text / voice / video threads..
            <span className="text-yellow-500">! </span> </p>
            <p>Make sure you must create or join the connection before creating a threads.</p> 
          </div>
        </div>
      </div>} */}

    </div>
  )
}

export default Secondary
