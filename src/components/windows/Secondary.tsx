import SecondaryWindowHeader from "../chat/SecondaryWindowHeader";
import { DBThread, PlainMember, PlainUserWithFriendWithUserAndInboxesWithUser } from "@/types";
import ChatInput from "../chat/ChatInput";
import StoreProvider from "@/store/StoreProvider";
import ChatMessages from "../chat/ChatMessages";
import MediaRoom from "../MediaRoom";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { serializeData } from "@/lib/serialized";

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

    const user = await currentUser();

    if(!user) return redirect("/sign-in");
    
    await dbConnect();

    const userData = await UserModel.findById(new mongoose.Types.ObjectId(user._id)).populate([
      {
        path : "friends",
        populate : [
          {path : "requestingUser"},
          {path : "requestedUser"}
        ]
      },
      {
        path : "inboxes",
        populate : {
          path : "sender"
        },
        options: {
          sort: {
            createdAt: -1
          }
        }
      }
    ]).lean().exec();
  
    const PlainUserData : PlainUserWithFriendWithUserAndInboxesWithUser = serializeData(userData);

  return (
    <div className="flex flex-col h-full">
      {type === "thread" && <SecondaryWindowHeader 
        name = {threadName}
        connectionId={connectionId}
        type={type}
        userId={user._id}
        inboxMessages={PlainUserData.inboxes}
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
        userId={user._id}
        inboxMessages={PlainUserData.inboxes}
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