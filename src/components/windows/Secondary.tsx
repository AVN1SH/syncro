import SecondaryWindowHeader from "../chat/SecondaryWindowHeader";
import { DBThread, PlainMember } from "@/types";
import ChatInput from "../chat/ChatInput";
import StoreProvider from "@/store/StoreProvider";
import ChatMessages from "../chat/ChatMessages";
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
    </div>
  )
}

export default Secondary