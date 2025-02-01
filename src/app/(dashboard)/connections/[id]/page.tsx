import NavigationSidebar from '@/components/navigation/NavigationSidebar';
import Primary from '@/components/windows/Primary';
import Secondary from '@/components/windows/Secondary';
import { currentUser } from '@/lib/currentUser';
import ConnectionModel from '@/model/connection.model';
import ThreadModel from '@/model/thread.model';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
  params : {
    id : string;
  }
}

const page = async({ params } : Props) => {

  const user = await currentUser();

  if(!user) return redirect("/sign-in");

  const checkingConnection = await ConnectionModel.aggregate([
    {
      $match : {
        _id : new mongoose.Types.ObjectId(params.id)
      }
    },
    {
      $lookup : {
        from : "members",
        localField : "members",
        foreignField : "_id",
        as : "members"
      }
    },
    { $unwind : "$members" },
    {
      $match : {
        "members.user" : new mongoose.Types.ObjectId(user._id)
      }
    },
    {
      $lookup : {
        from : "threads",
        localField : "threads",
        foreignField : "_id",
        as : "threads"
      }
    },
    { $unwind : "$threads" },
    {
      $match : {
        "threads.name" : "Hello World..!"
      }
    },
    {
      $sort : { createdAt : 1 }
    }
  ]);

  if(!checkingConnection.length) return null

  const initialThread = checkingConnection[0]?.threads?._id;

  return redirect(`/connections/${params.id}/threads/${initialThread}`);
  
  // return (
  //     <div className="fixed left-[310px] top-[40px] right-0 bottom-0">
  //       <Secondary />
  //     </div>
  // )
}

export default page