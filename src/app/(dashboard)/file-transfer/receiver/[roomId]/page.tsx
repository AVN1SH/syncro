"use client"
import { useParams } from 'next/navigation';
import Receiver from '@/components/transfer/Receiver';

export default function ReceivePage() {
  const params = useParams();
  const roomId = params?.roomId as string;

  if (!roomId) return <div>Loading...</div>;

  return <Receiver roomId={roomId} />;
}