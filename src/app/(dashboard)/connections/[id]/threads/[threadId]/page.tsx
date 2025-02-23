import Secondary from '@/components/windows/Secondary'
import { currentUser } from '@/lib/currentUser';
import { serializeData } from '@/lib/serialized';
import MemberModel from '@/model/member.model';
import ThreadModel from '@/model/thread.model';
import { DBMember, DBThread, PlainMember } from '@/types';
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
    user : new mongoose.Types.ObjectId(user._id)
  }).lean() as DBMember

  if(!member || !thread) redirect("/connections");

  const plainMember : PlainMember = serializeData(member);

  return (
    <div className="fixed left-[60px] md:left-[310px] top-0 right-0 bottom-0">
        <Secondary 
          threadName = {thread.name}
          threadType = {thread.type}
          connectionId={String(thread.connection)}
          type="thread"
          threadId={String(thread._id)}
          member={plainMember}
        />
    </div>
  )
}

export default page
