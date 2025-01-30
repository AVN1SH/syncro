import Secondary from '@/components/windows/Secondary'
import { currentUser } from '@/lib/currentUser';
import MemberModel from '@/model/member.model';
import ThreadModel from '@/model/thread.model';
import { DBMember, DBThread } from '@/types';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
  params : {
    id : string;
    threadId : string;
  }
}

const page = async({params} : Props) => {

  const user = await currentUser();

  if(!user) redirect("/sign-in");

  const thread = await ThreadModel.findById(params.threadId).lean() as DBThread;

  const member = await MemberModel.findOne({
    connection : new mongoose.Types.ObjectId(params.id),
    user : new mongoose.Types.ObjectId(user._id as string)
  }).lean() as DBMember

  if(!member || !thread) redirect("/connections");

  return (
    <div className="fixed left-[310px] top-[40px] right-0 bottom-0">
        <Secondary 
          name = {thread.name}
          connectionId={String(thread.connection)}
          type="thread"
        />
    </div>
  )
}

export default page
