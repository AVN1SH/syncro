import FriendsTopNav from "@/components/chat/FriendsTopNav";
import Inbox from "@/components/notifications/Inbox";
import { currentUser } from "@/lib/currentUser";
import dbConnect from "@/lib/dbConnect";
import { serializeData } from "@/lib/serialized";
import StoreProvider from "@/store/StoreProvider";
import { PlainUserWithFriendWithUserAndInboxesWithUser } from "@/types";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import Friends from "@/components/windows/Friends";
import UserModel from "@/model/user.model";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const page = async () => {

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
    <div className="fixed left-[60px] md:left-[310px] top-0 right-0 bottom-0">
      <StoreProvider>
        <div className="border-solid dark:border-zinc-800 border-zinc-200 border-b-[2px] h-[50px] flex justify-between">
          <FriendsTopNav />
          <Inbox 
            inboxMessages={PlainUserData.inboxes}
            userId={user._id}
          />
        </div>
        <div className="flex-1 h-full flex">
          <div className="flex-[2.2] h-full">
            <Friends 
              friends={PlainUserData.friends}
            />
          </div>
          <div className="flex-1 h-full border-l-[1px] border-zinc-200 dark:border-zinc-700 border-solid p-4 xl:block init:hidden">
            <div className="flex flex-col items-center justify-between h-full">
              <div>
                <h1 className="font-bold text-xl dark:text-zinc-300 text-zinc-700">Welcome to SyncRo!</h1>
                <p className="text-zinc-400 text-[16px]">Stay Synced with your friends</p>
                <div className="flex flex-col items-center justify-center self-center mx-7 mt-10 gap-3">
                  <p className="font-bold dark:text-zinc-300 text-zinc-700">Nothing here for now...</p>
                  <p className="text-center text-[14px] text-gray-400">We will show you updates, if any changes happens in this app.</p>
                  <p className="mt-2 text-center text-xs text-amber-500">you can visit our github page for more updates..!</p>
                  <Separator className="" />
                  <div className="flex gap-2 items-center cursor-pointer group duration-300">
                    <Github className="dark:bg-black dark:text-white text-black bg-white p-1 rounded-full group-hover:opacity-55 duration-300"/> 
                    <span className="text-xs group-hover:underline group-hover:text-blue-500 duration-300">
                      github
                    </span> 
                  </div>
                </div>
              </div>
              <div className="pb-10 flex flex-col gap-2 items-center justify-center">
                <p className="font-thin text-xs">This App Created and Designed By <span className="font-normal">Avnish Kr Sharma</span></p>
                <div className="flex gap-2 items-center w-full">
                  <Separator className="flex-1 dark:bg-zinc-600 bg-zinc-400"/>
                  <p className="font-semibold text-xs">FOLLOW</p>
                  <Separator className="flex-1 dark:bg-zinc-600 bg-zinc-400"/>
                </div>
                <div className="flex gap-4 items-center">
                  <Badge className="bg-black cursor-pointer text-white hover:bg-white hover:text-black">X</Badge>
                  <Badge className="bg-gradient-to-r from-violet-600 via-red-600 to-amber-500 text-white cursor-pointer hover:opacity-75">Instagram</Badge>
                  <Badge className="font-bold hover:bg-black hover:text-white cursor-pointer">Github</Badge>
                  <Badge className="bg-red-600 text-white hover:text-red-600 hover:bg-white cursor-pointer">YouTube</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StoreProvider>
    </div>
  );
}
export default page