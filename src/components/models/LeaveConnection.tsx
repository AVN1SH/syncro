"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { onClose, onOpen } from "@/features/modelSlice"
import { Label } from "@radix-ui/react-label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Check, Copy, RefreshCw } from "lucide-react"
import useOrigin from "@/hooks/useOrigin"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const LeaveConnection = () => {
  const { isOpen, type, data } = useSelector((state : RootState) => state.createConnectionSlice);
  const isModelOpen = isOpen && type === "leaveConnection";
  const [modelOpen, setModelOpen] = useState(isModelOpen);
  const connectionId = data?.connectionId;
  const dispatch = useDispatch();
  
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(isOpen && type === "leaveConnection") {
      setModelOpen(true);
    }
  }, [isOpen]);

  const handleOpenChange = () => {
      dispatch(onClose());
      setModelOpen(false);
  };

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/connections/${String(data.connectionId)}/leave`)

      dispatch(onClose());
      router.refresh();
      router.push("/connections");
      
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={modelOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-neutral-800 dark:text-white">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Leave Connection</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure You want to leave <span className=" font-semibold text-red-500">{data?.connectionName}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="dark:bg-neutral-900 bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button disabled={isLoading} variant="ghost" 
                onClick={handleOpenChange}
                className="text-yellow-500 hover:text-yellow-400 hover:bg-zinc-950"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} variant="ghost" 
                onClick={onClick}
                className="hover:bg-zinc-950 hover:animate-pulse hover:text-rose-600 duration-350 transition-[2s]"
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LeaveConnection;
