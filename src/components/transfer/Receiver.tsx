'use client';
import { useEffect, useRef } from 'react';

interface ReceiverProps {
  roomId: string;
}

export default function Receiver({ roomId }: ReceiverProps) {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);

  useEffect(() => {
    const setupWebRTC = async () => {
      peerConnection.current = new RTCPeerConnection();

      peerConnection.current.ondatachannel = (event) => {
        dataChannel.current = event.channel;
        dataChannel.current.onmessage = (e) => {
          const blob = new Blob([e.data], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'received-file';
          a.click();
        };
      };

      const response = await fetch(`/api/signal?roomId=${roomId}`);
      const offer = await response?.json();
      await peerConnection.current.setRemoteDescription(offer);

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      await fetch(`/api/signal?roomId=${roomId}`, {
        method: 'POST',
        body: JSON.stringify({ message: answer }),
      });
    };

    setupWebRTC();
  }, [roomId]);

  return <div className="fixed left-[60px] md:left-[310px] w-full h-full flex items-center justify-center p-2">Downloading file...</div>;
}