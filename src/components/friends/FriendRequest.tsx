"use client";
import { Handshake, UserCheck2, UserPlus2 } from 'lucide-react';
import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DBFriend } from '@/types';

interface Props {
  requestedUserId : string;
  friendStatus : DBFriend["status"];
}

const FriendRequest = ({requestedUserId, friendStatus} : Props) => {
  const router = useRouter();

  const handleRequest = async () => {
    try {
      const response = await axios.post("/api/friend-request", {
        requestedUserId
      })
      if(response) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="pr-2">
      {friendStatus === "accepted"
        ? <Handshake className="size-5 text-amber-500 hover:text-amber-600 cursor-pointer" />
        : friendStatus === "pending" ? 
          <UserCheck2 className="size-5 text-amber-500 hover:text-amber-600 cursor-pointer"/>
        : 
        <UserPlus2 
          onClick={handleRequest}
          className="size-5 text-amber-500 hover:text-amber-600 cursor-pointer"
        />
      }
    </div>
  )
}

export default FriendRequest;