"use client";
import { DBConnection, DBMember } from "@/types";
import { faImage } from "@fortawesome/free-regular-svg-icons"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Edit, UploadCloud } from "lucide-react";
import { useDispatch } from "react-redux";
import { onOpen } from "../../features/modelSlice";

interface Props {
  connectionId : DBConnection["_id"],
  connectionBannerPhotoUrl : string;
  role ?: DBMember["role"]
}

const Banner = ({connectionId, connectionBannerPhotoUrl, role} : Props) => {

  const dispatch = useDispatch();

  return (
    <div className="dark:bg-zinc-600 bg-zinc-400 h-[120px] object-cover object-center flex items-center justify-center">
      {connectionBannerPhotoUrl 
      ?<div className="relative w-full h-full"> 
          <img src={connectionBannerPhotoUrl} className="w-full h-full object-cover object-center"/>

          <div className="absolute bottom-0 right-0 left-0 h-[10px] dark:bg-gradient-to-b dark:from-transparent dark:to-[#2b2d31] bg-gradient-to-b from-transparent to-zinc-100" />

          {role !== "guest" && <Edit 
            onClick={() => dispatch(onOpen({ type : "uploadBanner", data : { connectionId }}))}
            className="absolute bottom-[5px] right-[5px] text-zinc-700 dark:text-zinc-500 cursor-pointer bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-800 rounded-full h-6 w-6 p-1 dark:hover:text-yellow-500 hover:bg-zinc-300 hover:text-yellow-600 transition duration-300 drop-shadow-md"
          />}
        </div>
      :<div className="relative w-full h-full">
        <FontAwesomeIcon icon={faImage} size="4x" className="text-zinc-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <FontAwesomeIcon icon={faTriangleExclamation} size="xl" className="text-yellow-500 absolute bottom-[17px] right-[85px] opacity-70" />
        {role !== "guest" && <UploadCloud 
          onClick={() => dispatch(onOpen({ type : "uploadBanner", data : { connectionId }}))}
          className="absolute bottom-[5px] right-[5px] text-zinc-700 dark:text-zinc-500 cursor-pointer bg-zinc-700 rounded-full h-6 w-6 p-1 dark:hover:text-yellow-500 hover:bg-zinc-800 transition duration-300 drop-shadow-md"
        />}
      </div>}
    </div>
  )
}

export default Banner
