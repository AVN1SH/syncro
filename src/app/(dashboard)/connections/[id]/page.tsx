import { currentUser } from '@/lib/currentUser';
import ConnectionModel from '@/model/connection.model';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';

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
        "threads.name" : "general"
      }
    },
    {
      $sort : { createdAt : 1 }
    }
  ]);

  if(!checkingConnection.length) return null

  const initialThread = checkingConnection[0]?.threads?._id;

  return redirect(`/connections/${params.id}/threads/${initialThread}`);
}

export default page