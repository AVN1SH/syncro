"use client"

import React, { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import "@livekit/components-styles";
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { SessionUser } from '@/types';

interface Props {
  chatId : string;
  video : boolean;
  audio : boolean;
}

const MediaRoom = ({chatId, video, audio} : Props) => {
  
  const [token, setToken] = useState('');
  const { data: session } = useSession();
  const user : SessionUser = session?.user;

  useEffect(() => {
    if(!user?.name) return;

    const name = `${user?.name}`;

    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.log(e)
      }
    })();
  }, [user?.name, chatId]);

  if(token === '') {
    return(
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 
          className="size-7 text-zinc-500 animate-spin my-4"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading...
        </p>
      </div>
    )
  }
  return (
  <div className="h-full pb-12">
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  </div>
  )
}

export default MediaRoom
