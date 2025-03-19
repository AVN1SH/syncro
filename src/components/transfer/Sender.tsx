'use client';
import { useEffect, useRef, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Ban, Check, CloudUpload, Copy, File, FileArchive, FileAudio2, FileText, FileVideo, Image, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function Sender() {
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
      console.log(type)
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
    setIsLoading(true)

    const roomId = generateRoomId();
    setLink(`${window.location.origin}/file-transfer/receiver/${roomId}`);

    const configuration = {
      iceServers: [
          { urls: "stun:stun.l.google.com:19302" }
      ]
  };

    const localConnection = new RTCPeerConnection(configuration);
    setPeerConnection(localConnection);

    localConnection.onicecandidate = (async (event) => {
      if (!event.candidate) {
        await fetch(`/api/signal?roomId=${roomId}`, {
          method: 'POST',
          body: JSON.stringify({ message: localConnection.localDescription, type : "offer" }),
        });
      }
    });

    const dataChannel = localConnection.createDataChannel('fileTransfer');

    dataChannel.onopen = () => {
      console.log('Data channel opened');
      
      const fileMetadata = {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      };

      dataChannel.send(JSON.stringify({ metadata: fileMetadata }));
      
      const CHUNK_SIZE = 16 * 1024;
      const reader = new FileReader();
      let offset = 0;
      reader.onload = async (event) => {
        if (event.target?.result) {
          const arrayBuffer = reader.result as ArrayBuffer;
          while (offset < arrayBuffer.byteLength) {
            const chunk = arrayBuffer.slice(offset, offset + CHUNK_SIZE);
            dataChannel.send(chunk);
            offset += CHUNK_SIZE;
            await new Promise((resolve) => setTimeout(resolve, 0.5));
          }
          console.log("File sent successfully!");
        } else {
          console.error("Error reading file!");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    };

    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);

    const interval = setInterval(async () => {
      const response = await fetch(`/api/signal?roomId=${roomId}&type=answer`, {
        method : "GET",
      });
      const answer = await response?.json();
      if (answer.type === 'answer') {
        await localConnection.setRemoteDescription(answer);
        clearInterval(interval);
        intervalRef.current = null;
      }
    }, 1000);
    setAnimate(true);
    setIsLoading(false);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <div className={`flex items-center justify-center flex-1 before:contents-[''] before:size-[410px] before:rounded-full before:absolute before:bg-gradient-to-r before:from-yellow-500 before:via-purple-500 before:to-red-500 before:blur-3xl before:animate-[spin_6s_linear_infinite] transition-all duration-300 ${!animate && "before:hidden"}`}>
      <div className="flex items-center justify-center size-[300px] sm:size-[460px] overflow-hidden rounded-lg transition-all duration-300">
        <div className={`flex flex-col items-center justify-center gap-2 relative rounded-lg bg-white text-black dark:bg-neutral-900 dark:text-white before:contents-[''] size-[450px] before:size-[750px] before:absolute before:bg-gradient-to-r before:from-yellow-500 before:via-purple-500 before:to-red-500 before:rounded-full before:-z-10 before:animate-[spin_6s_linear_infinite] transition-all duration-300 ${!animate && "overflow-hidden"}`}>
          <div className="flex flex-col">
            <h3 className="text-xl sm:text-3xl text-center font-bold">Transfer Files</h3>
            <h2 className="text-zinc-400 text-xs text-[16px] text-center" >{"No data required to transfer files if sender and receiver are on same network"}<span className="text-yellow-500">.</span></h2>
          </div>

          <div className="flex flex-col w-full px-2 sm:px-6 gap-1 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-4">
              <input
                id='fileInput'
                className="hidden"
                type="file"
                accept="image/*, .pdf, .zip, .tar, video/*" 
                onChange={handleOnSelect} 
              />
              <label htmlFor="fileInput" className="size-[40px] sm:size-[80px] bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600 transition-all duration-300 group flex items-center justify-center">
                <CloudUpload className="size-full group-hover:size-[calc(100%-6px)] p-1 sm:p-4 group-hover:animate-pulse duration-300" />
              </label>
              {!file && <div className="dark:bg-zinc-700 bg-zinc-300 flex items-center justify-center flex-1 h-[calc(100%-10px)] sm:h-[calc(100%-30px)] rounded-lg text-sm sm:text-xl font-semibold dark:text-zinc-300 text-zinc-600">
                No File Choosen Yet.
              </div>}
              {file && <div className="dark:bg-zinc-700 bg-zinc-300 flex gap-2 items-center flex-1 h-[calc(100%-10px)] sm:h-[calc(100%-30px)] rounded-lg p-2">
                <Icon className="size-8" />
                <p className="text-sm sm:text-xl font-semibold dark:text-zinc-300 text-zinc-600">{file.name.length > 18 ? file.name.slice(0, 18) + '...' : file.name}</p>
              </div>}
            </div>
            {error && <p className="text-rose-500 font-semibold flex flex-shrink-0 items-center gap-2 text-xs sm:text-[16px]"><Ban size={16} /> {error}</p>}
            <Button type='submit' variant='secondary' onClick={handleFileSelect} className="h-[30px] sm:h-[40px] text-xs sm:text-[16px]">
              ✨ Click to {animate ? "ReGenerate New" : "Generate"} Link
            </Button>
          </div>

          {animate && <div className="bg-rose-600 text-xs sm:text-[16px] mx-2 sm:mx-6 p-1 sm:p-2 rounded-lg animate-pulse">
            {"You have to keep this window open until the reciever completes it's download."}
          </div>}

          <div className="px-2 sm:px-6 w-full">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-text-secondary/70 dark:text-zinc-400">
              Receiver Invite link
            </Label>

            <div className="flex item-center mt-1 gap-x-2">
              <Input 
                disabled={isLoading}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 text-xs sm:text-[16px] h-[30px] sm:h-[40px]"
                value={link}
                readOnly
              />
              <Button 
              disabled={isLoading} 
              onClick={onCopy} 
              size="icon" 
              className="bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 size-[30px] sm:size-[40px]">
                {copied ? (
                  <Check className="init:w-3 sm:w-4 init:h-3 sm:h-4" />
                ) : (
                  <Copy className="init:w-3 sm:w-4 init:h-3 sm:h-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={onReset}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="text-[10px] sm:text-xs text-yellow-500 mt-1 sm:mt-2"
            >
              Reset or try new file
              <RefreshCw className="w-3 sm:w-4 h-3 sm:h-4 ml-1 sm:ml-2"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}