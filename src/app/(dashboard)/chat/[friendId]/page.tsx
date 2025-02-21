import MediaRoom from '@/components/MediaRoom';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import FriendsTopNav from '@/components/chat/FriendsTopNav';
import SecondaryWindowHeader from '@/components/chat/SecondaryWindowHeader';
import Inbox from '@/components/notifications/Inbox';
import Secondary from '@/components/windows/Secondary'
import { currentUser } from '@/lib/currentUser';
import dbConnect from '@/lib/dbConnect';
import { getOrCreateConversation } from '@/lib/friendConversation';
import { serializeData } from '@/lib/serialized';
import FriendModel from '@/model/friend.model';
import MemberModel from '@/model/member.model';
import StoreProvider from '@/store/StoreProvider';
import { DBConversation, MemberWithUser, PlainFriendWithUser, PlainUser } from '@/types';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'
import { serialize } from 'v8';

interface Props {
  params : {
    friendId : string;
  }
  searchParams : {
    video ?: boolean;
  }
}

const page = async({params, searchParams} : Props) => {

  const user = await currentUser();

  if(!user) return redirect("/sign-in");
  
  await dbConnect();

  const friendship = await FriendModel.findById(new mongoose.Types.ObjectId(params.friendId)).populate(["requestingUser", "requestedUser"]).lean().exec() as PlainFriendWithUser;

  if(!friendship) return redirect("/chat");

  const plainFriendship : PlainFriendWithUser = serializeData(friendship);

  if(friendship.status !== "accepted") return redirect("/chat");
  
  const friendOfUser = plainFriendship?.requestingUser?._id === user._id ? plainFriendship?.requestedUser : plainFriendship?.requestingUser;

  const conversation = await getOrCreateConversation(user._id, friendOfUser._id);
  
  if(!conversation) return redirect("/chat");
  
  const { userOne, userTwo } = conversation;

  const otherUser = String(userOne._id) === user._id ? userTwo : userOne;

  const plainOtherUser : PlainUser = serializeData(otherUser);

  return (
    <div className="fixed left-[310px] top-0 right-0 bottom-0 flex flex-col h-full">
      {<SecondaryWindowHeader
        imageUrl={plainOtherUser.imageUrl}
        name={plainOtherUser.name}
        type={"conversation"}
      />}
      {searchParams.video && (
        <MediaRoom
          chatId={params.friendId}
          video={true}
          audio={true}
        />
      )}

      {!searchParams.video && (
        <>
          {<ChatMessages 
            name={plainOtherUser.name}
            userId={user._id}
            chatId={String(conversation._id)}
            type="friendConversation"
            apiUrl="/api/friendMessages"
            socketurl="/api/socket/friendMessages"
            socketQuery={{
              friendConversationId : String(conversation._id)
            }}
            paramKey="friendConversationId"
            paramValue={String(conversation._id)}
          />}
          <StoreProvider>
            <ChatInput 
              name={plainOtherUser.name}
              type="friendConversation"
              apiUrl="/api/socket/friendMessages"
              friendUserId={friendOfUser._id ? friendOfUser._id : ''}
              friendId={plainFriendship._id}
              query={{
                friendConversationId : conversation._id,
              }}
            />
          </StoreProvider>
        </>
      )}
      
      {/* <Secondary
        imageUrl={otherMember.user.imageUrl}
        threadName={otherMember.user.name}
        connectionId={params.id}
        type="conversation"
        member={plainMember}
        memberName={otherMember.user.name}
        conversationId={String(conversation._id)}
        video={searchParams.video}
      /> */}
    </div>
  )
}

export default page