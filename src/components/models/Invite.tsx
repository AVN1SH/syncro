"use client"
import {
  Dialog,
  DialogContent,
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

const Invite = () => {
  const { isOpen, type, data } = useSelector((state : RootState) => state.createConnectionSlice);
  const isModelOpen = isOpen && type === "invite";
  const [modelOpen, setModelOpen] = useState(isModelOpen);
  const inviteCode = data?.inviteCode;
  const connectionId = data?.connectionId;
  const dispatch = useDispatch();
  const origin = useOrigin();
  
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inviteUrl = `${origin}/connections/invite/${inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/connections/${connectionId}/invite-code`);
      dispatch(onOpen({
        type : "invite",
        data : {
          inviteCode : response.data?.inviteCode,
          connectionId : connectionId
        }
      }))
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(isOpen && type === "invite") {
      setModelOpen(true);
    }
  }, [isOpen]);

  const handleOpenChange = () => {
      dispatch(onClose());
      setModelOpen(false);
  };

  return (
    <div>
      <Dialog open={modelOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-neutral-800 dark:text-white">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Invite Peoples</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-text-secondary/70 dark:text-zinc-400">
              Connection Invite link
            </Label>
            <div className="flex item-center mt-2 gap-x-2">
              <Input 
                disabled={isLoading}
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                value={inviteUrl}
                readOnly
              />
              <Button disabled={isLoading} onClick={onCopy} size="icon" className="bg-yellow-400 hover:bg-yellow-500 transition-all duration-300">
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={onNew}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="text-xs text-yellow-500 mt-4"
            >
              Generate a new link
              <RefreshCw className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Invite;