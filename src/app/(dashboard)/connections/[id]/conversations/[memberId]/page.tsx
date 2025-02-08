import Secondary from '@/components/windows/Secondary'
import { getOrCreateConversation } from '@/lib/conversation';
import { currentUser } from '@/lib/currentUser';
import dbConnect from '@/lib/dbConnect';
import { serializeData } from '@/lib/serialized';
import MemberModel from '@/model/member.model';
import { DBConversation, MemberWithUser } from '@/types';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';
import React from 'react'
import { serialize } from 'v8';

interface Props {
  params : {
    id : string;
    memberId : string;
  }
  searchParams : {
    video ?: boolean;
  }
}

const page = async({params, searchParams} : Props) => {

  const user = await currentUser();

  if(!user) return redirect("/sign-in");
  
  await dbConnect();

  const currentMember = await MemberModel.findOne({
    user : new mongoose.Types.ObjectId(user._id as string),
    connection : new mongoose.Types.ObjectId(params.id)
  }).populate("user").lean() as MemberWithUser;

  if(!currentMember.user._id) return redirect("/connections");

  const conversation = await getOrCreateConversation(String(currentMember._id), params.memberId);
  
  if(!conversation) return redirect(`/connections/${params.id}`);
  
  const { memberOne, memberTwo } = conversation;

  const otherMember = String(memberOne.user._id) === user._id ? memberTwo : memberOne;

  const plainMember = serializeData(currentMember);

  return (
    <div className="fixed left-[310px] top-0 right-0 bottom-0">
      <Secondary
        imageUrl={otherMember.user.imageUrl}
        threadName={otherMember.user.name}
        connectionId={params.id}
        type="conversation"
        member={plainMember}
        memberName={otherMember.user.name}
        conversationId={String(conversation._id)}
        video={searchParams.video}
      />
    </div>
  )
}

export default page
