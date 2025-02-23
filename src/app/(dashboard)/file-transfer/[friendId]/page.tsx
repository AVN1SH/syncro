import SecondaryWindowHeader from '@/components/chat/SecondaryWindowHeader'
import SendToFriend from '@/components/transfer/SendToFriend';
import { currentUser } from '@/lib/currentUser';
import dbConnect from '@/lib/dbConnect';
import { serializeData } from '@/lib/serialized';
import FriendModel from '@/model/friend.model';
import UserModel from '@/model/user.model';
import { PlainFriendWithUser, PlainUserWithFriendWithUserAndInboxesWithUser } from '@/types';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
interface Props {
  params : {
    friendId : string;
  }
}

const page = async({params} : Props) => {
  const { friendId } = params;

  const user = await currentUser();

  dbConnect();

  if(!user) redirect("/sign-in");

  const friend = await FriendModel.findById(new mongoose.Types.ObjectId(friendId)).populate(["requestingUser", "requestedUser"]).lean().exec();

  const plainFriend : PlainFriendWithUser = serializeData(friend);

  const firendUserId = plainFriend.requestingUser._id === user._id ? plainFriend.requestedUser._id : plainFriend.requestingUser._id;

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
    <div className='fixed left-[60px] md:left-[310px] top-0 right-0 bottom-0'>
      <div className="relative top-0 h-full w-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
        <SecondaryWindowHeader 
          name={user.name}
          imageUrl={user.imageUrl}
          type="conversation"
          userId={user._id}
          inboxMessages={PlainUserData.inboxes}
        />
        <div className="absolute left-0 right-0 bottom-0 top-[50px] overflow-hidden wave-container">
          <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-zinc-400 rounded-full animate-float" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-zinc-500 rounded-full animate-float" />
          <div className="absolute top-0 right-40 w-24 h-24 bg-zinc-500 rounded-full animate-float " />
          <div className="absolute left-0 right-1/4 w-32 h-32 bg-zinc-500 rounded-full animate-float" />
        </div>
        <div className="relative z-10 flex h-full items-center justify-center text-white">
          <SendToFriend 
            friendUserId={firendUserId}
          />
        </div>
      </div>
    </div>
  )
}

export default page