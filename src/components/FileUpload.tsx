"use client"

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { error } from "console";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  onChange: (url?: string) => void;
  value?: string;
  endpoint : "messageFile" | "connectionImage";
  banner ?: boolean;
}
const FileUpload = ({onChange, value, endpoint, banner}: Props) => {

  const[fileType, setFileType] = useState<string | null>(null)

  if (value && !fileType?.includes("pdf")) {
    return (
      <div className={cn("relative left-1/2 transform -translate-x-1/2", banner ? "h-20 w-40" : "h-20 w-20")}>
        <Image 
          fill
          sizes="100%"
          src={value}
          alt="Upload"
          className={cn("object-cover", banner ? "rounded-sm" : "rounded-full")}
        />
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if(value && fileType?.includes("pdf")) {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-yellow-500/10">
        <FileIcon className="h-10 w-10 fill-yellow-200 stroke-yellow-400" />
        
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-yellow-500 dark:text-yellow-400 hover:underline overflow-hidden break-all text-center"
        >
          {value}
        </a>
        <button
          onClick={() => onChange('')}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone
      className="dark:bg-neutral-800"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if(res?.[0]) {
          setFileType(res?.[0].type);
          onChange(res?.[0].url);
        }
      }}
      onUploadError={(error : Error) => {
        console.log(error);
      }}
    />
  )
}

export default FileUpload
