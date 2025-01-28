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
import { ConnectionType } from '@/types/modelTypes';
import StoreProvider from '@/store/StoreProvider';

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
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1e1f22] bg-[#e3e5e8] py-3">
      <StoreProvider>
        <NavigationAction />
      </StoreProvider>
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
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
  );
}

export default NavigationSidebar;
