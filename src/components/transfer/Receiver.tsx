'use client';
import { useEffect, useRef, useState } from 'react';
import { Progress } from '../ui/progress';
import { Loader2 } from 'lucide-react';

interface ReceiverProps {
  roomId: string;
}

export default function Receiver({ roomId }: ReceiverProps) {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const setupWebRTC = async () => {
      const configuration = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    };
      peerConnection.current = new RTCPeerConnection(configuration);

      peerConnection.current.onicecandidate = (async(event) => {
        if(!event.candidate) {
          await fetch(`/api/signal?roomId=${roomId}`, {
            method: 'POST',
            body: JSON.stringify({ message: peerConnection.current?.localDescription , type : "answer"}),
          });
        }
      } )

      peerConnection.current.ondatachannel = (event) => {
        console.log("remote datachannel opened")
        dataChannel.current = event.channel;
        let fileMetadata: { name: string; type: string, size : number } | null = null;
        let receivedChunks: ArrayBuffer[] = [];
        let receivedSize = 0;

        dataChannel.current.binaryType = "arraybuffer";

        dataChannel.current.onmessage = (e) => {
          if(typeof e.data === "string"){
            try {
              const jsonData = JSON.parse(e.data);
              if (jsonData.metadata) {
                fileMetadata = jsonData.metadata;
                return;
              }
            } catch (error) {
              console.log(error)
            }
          } else if(e.data instanceof ArrayBuffer) {
            setCompleted(false);
            if (!fileMetadata) {
              console.error("File metadata not received yet!");
              return;
            }
  
            receivedChunks.push(e.data);
            receivedSize += e.data.byteLength;

            setProgress((receivedSize*100) / fileMetadata.size);
            
            if (receivedSize >= fileMetadata.size) {
              console.log("File transfer complete!");

              setCompleted(true);
      
              const blob = new Blob(receivedChunks, { type: fileMetadata.type });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = fileMetadata.name;
              a.click();
      
              // Cleanup
              receivedChunks = [];
              fileMetadata = null;
            }
          }

        };
      };

      const response = await fetch(`/api/signal?roomId=${roomId}&type=offer`, {
        method : "GET",
      });
      const offer = await response?.json();
      await peerConnection.current.setRemoteDescription(offer);

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

    };
    setupWebRTC();
  }, [roomId]);

  return <div className="fixed inset-0 flex items-center justify-center p-2 z-50 bg-zinc-800">
    <div className="flex items-center justify-center flex-col gap-3 w-[400px]">
    {completed ? <p className="text-zinc-500 text-sm">File Received. You now close this window</p>
      : <p className="text-zinc-500 text-sm flex items-center gap-1">Downloading File...! Plese Wait<Loader2 className='size-[13px] animate-spin text-amber-500' /></p>}
      <Progress  value={progress}/>
    </div>
  </div>;
}