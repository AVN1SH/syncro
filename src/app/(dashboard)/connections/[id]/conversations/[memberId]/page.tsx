import Secondary from '@/components/windows/Secondary'
import { getOrCreateConversation } from '@/lib/conversation';
import { currentUser } from '@/lib/currentUser';
import dbConnect from '@/lib/dbConnect';
import MemberModel from '@/model/member.model';
import { DBConversation, MemberWithUser } from '@/types';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
  params : {
    id : string;
    memberId : string;
  }
}

const page = async({params} : Props) => {

  const user = await currentUser();

  if(!user) return redirect("/sign-in");
  
  await dbConnect();

  const currentMember = await MemberModel.findOne({
    user : new mongoose.Types.ObjectId(user._id as string),
    connection : new mongoose.Types.ObjectId(params.id)
  }).populate("user").lean() as MemberWithUser;

  if(!currentMember) return redirect("/connections");

  const conversation = await getOrCreateConversation(String(currentMember._id), params.memberId);

  if(!conversation) return redirect(`/connections/${params.id}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember = String(memberOne.user._id) === user._id ? memberTwo : memberOne;

  return (
    <div className="fixed left-[310px] top-[40px] right-0 bottom-0">
      <Secondary
        imageUrl={otherMember.user.imageUrl}
        name={otherMember.user.name}
        connectionId={params.id}
        type="conversation"
      />
    </div>
  )
}

export default page
