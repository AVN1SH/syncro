'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Ban, CloudUpload, File, FileArchive, FileAudio2, FileText, FileVideo, Image, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const iconMap = {
  jpeg : Image,
  jpg : Image,
  png : Image,
  webp : Image,
  pdf : FileText,
  docx : FileText,
  zip : FileArchive,
  tar : FileArchive,
  mp3 : FileAudio2,
  m4a : FileAudio2,
  mp4 : FileVideo,
  mov : FileVideo,
  default : File,
  none : '',
}

interface Props {
  friendUserId : string;
}

export default function SendToFriend({friendUserId} : Props) {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [Icon, setIcon] = useState<any>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();

  const generateRoomId = () => Math.random().toString(36).substring(7);

  const handleOnSelect = (e : React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    Object.keys(iconMap).forEach((key) => {
      const type = selectedFile.type.split('/');
      if (type[1] === key) {
        setIcon(iconMap[key as keyof typeof iconMap]);
      }
    });

    setFile(selectedFile);
    setError('');
  }

  useEffect(() => {
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [peerConnection]);

  const onReset = () => {
    setFile(null);
    setLink('');
    setCopied(false);
    setError('');
    setIsLoading(false);
    setAnimate(false);
    setIcon(iconMap.none);
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setAnimate(false);
    setIsLoading(false);
    (document.getElementById('fileInput') as HTMLInputElement).value = '';
    router.refresh();
    window.location.reload();
  }

  const handleFileSelect = async () => {
    const selectedFile = file;
    if (!selectedFile){
      setError("Please Select your file first");
      return;
    }
    setAnimate(true);
    setIsLoading(true);

    const roomId = generateRoomId();
    setLink(`${window.location.origin}/file-transfer/receiver/${roomId}`);

    const peerConnection = new RTCPeerConnection();
    setPeerConnection(peerConnection);

    const dataChannel = peerConnection.createDataChannel('fileTransfer');
    dataChannel.onopen = () => {
      const reader = new FileReader();
      reader.onload = () => {
        dataChannel.send(reader.result as ArrayBuffer);
      };
      reader.readAsArrayBuffer(selectedFile);
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    await fetch(`/api/signal?roomId=${roomId}`, {
      method: 'POST',
      body: JSON.stringify({ message: offer }),
    });

    try {
      const response = await axios.post("/api/socket/notifications", {
        title : "File Download Link",
        type : "fileLink",
        content : `${window.location.origin}/file-transfer/receiver/${roomId}`,
        friendUserId
      })
    } catch (error) {
      console.log(error);
    }

    const interval = setInterval(async () => {
      const response = await fetch(`/api/signal?roomId=${roomId}`);
      if(!response.ok) {
        setError("Error While Fetching Signal, Please Try again");
        clearInterval(interval)
        return;
      }
      const text = await response.text();
      if(!text) return;

      try {
        const answer = JSON.parse(text);
        if (answer.type === 'answer') {
          await peerConnection.setRemoteDescription(answer);
          clearInterval(interval);
          intervalRef.current = null;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        setError("Error processing signal data. Please try again.");
        clearInterval(interval);
      }
    }, 1000);
    
    setIsLoading(false);
  };

  return (
    <div className={`flex items-center justify-center flex-1 before:contents-[''] before:size-[410px] before:rounded-full before:absolute before:bg-gradient-to-r before:from-yellow-500 before:via-purple-500 before:to-red-500 before:blur-3xl before:animate-[spin_6s_linear_infinite] transition-all duration-300 ${!animate && "before:hidden"}`}>
      <div className="flex items-center justify-center size-[460px] overflow-hidden rounded-lg transition-all duration-300">
        <div className={`flex flex-col items-center justify-center gap-2 relative rounded-lg bg-white text-black dark:bg-neutral-900 dark:text-white before:contents-[''] size-[450px] before:size-[750px] before:absolute before:bg-gradient-to-r before:from-yellow-500 before:via-purple-500 before:to-red-500 before:rounded-full before:-z-10 before:animate-[spin_6s_linear_infinite] transition-all duration-300 ${!animate && "overflow-hidden"}`}>
          <div className="flex flex-col">
            <h3 className="text-3xl text-center font-bold">Transfer Files</h3>
            <h2 className="text-zinc-400" >You Can Share Your File's Without Uploading It<span className="text-yellow-500">.</span></h2>
          </div>

          <div className="flex flex-col w-full px-6 gap-4">
            <div className="flex items-center gap-4">
              <input
                id='fileInput'
                className="hidden"
                type="file"
                accept="image/*, .pdf, .zip, .tar, video/*" 
                onChange={handleOnSelect} 
              />
              <label htmlFor="fileInput" className="size-[80px] bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600 transition-all duration-300 group flex items-center justify-center">
                <CloudUpload className="size-full group-hover:size-[calc(100%-6px)] p-4 group-hover:animate-pulse duration-300" />
              </label>
              {!file && <div className="dark:bg-zinc-700 bg-zinc-300 flex items-center justify-center flex-1 h-[calc(100%-30px)] rounded-lg text-xl font-semibold dark:text-zinc-300 text-zinc-600">
                No File Choosen Yet.
              </div>}
              {file && <div className="dark:bg-zinc-700 bg-zinc-300 flex gap-2 items-center flex-1 h-[calc(100%-30px)] rounded-lg p-2">
                <Icon className="size-8" />
                <p className="text-xl font-semibold dark:text-zinc-300 text-zinc-600">{file.name.length > 18 ? file.name.slice(0, 18) + '...' : file.name}</p>
              </div>}
            </div>
            {error && <p className="text-rose-500 font-semibold flex flex-shrink-0 items-center gap-2"><Ban size={16} /> {error}</p>}
            <Button type='submit' variant='secondary' onClick={handleFileSelect}>
              ✨ Click to {animate ? "Send New" : "Send"} Link
            </Button>
          </div>

          {animate && <div className="bg-rose-600 mx-6 p-2 rounded-lg animate-pulse">
            You have to keep this window open until the reciever completes it's download.
          </div>}

          <div className="px-6 w-full">
            <Button
              onClick={onReset}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="text-xs text-yellow-500 mt-2"
            >
              Reset or try new file
              <RefreshCw className="w-4 h-4 ml-2"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}