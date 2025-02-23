import React from 'react'
import { currentUser } from '@/lib/currentUser';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/dbConnect';
import NavigationAction from './NavigationAction';
import { Separator } from '@/components/ui/separator';
import ConnectionModel from '@/model/connection.model';
import InitialConnection from '../models/InitialConnection';
import { ScrollArea } from '../ui/scroll-area';
import SideNavigationItems from './SideNavigationItems';
import mongoose from 'mongoose';
import StoreProvider from '@/store/StoreProvider';
import NavFeatures from './NavFeatures';
import { ModeToggle } from '../themeToggle';
import ProfileInfo from './ProfileInfo';

const NavigationSidebar = async () => {

  await dbConnect();

  const user = await currentUser();

  if(!user) {
    return redirect("/sign-in");
  }

  const connections = await ConnectionModel.aggregate([
    {
      $lookup: {
        from: "members",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $match: {
        "members.user": new mongoose.Types.ObjectId(user._id as string),
      },
    },
  ]);

  return (
    <div className="flex flex-col justify-between h-full dark:bg-[#1e1f22] bg-[#e3e5e8] relative z-20">
      <div className="space-y-4 flex flex-col items-center h-full text-primary w-full py-3">
        <NavFeatures />

        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

        <StoreProvider>
          <NavigationAction />
        </StoreProvider>

        {connections.length === 0 && <InitialConnection  />}
        
        <ScrollArea className="flex-1 w-full">
          {connections && connections.map((connection) => (
            <div key={connection._id.toString()} className="mb-4">
              <SideNavigationItems 
                id={connection._id.toString()}
                imageUrl={connection.profilePhotoUrl}
                name={connection.name}
                active={connections[0] ? true : false}
              />
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="flex flex-col items-center justify-center">
        <ModeToggle />
        <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
        <div className="overflow-hidden p-2">
          <ProfileInfo 
            imageUrl={user.imageUrl}
            name={user.name}
            username={user.username}
            email={user.email}
            userId={user._id}
            type="self"
          />
        </div>
      </div>
    </div>
  );
}

export default NavigationSidebar;