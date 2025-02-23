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
import { onClose } from "@/features/modelSlice"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import qs from "query-string"
import { toast } from "sonner"

const DeleteThread = () => {
  const { isOpen, type, data } = useSelector((state : RootState) => state.createConnectionSlice);
  const isModelOpen = isOpen && type === "deleteThread";
  const [modelOpen, setModelOpen] = useState(isModelOpen);
  const dispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(isOpen && type === "deleteThread") {
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
      const url = qs.stringifyUrl({
        url: `/api/threads/${String(data?.thread?._id)}`,
        query : {
          connectionId: data?.connectionId
        }
      })

      await axios.delete(url)
      toast("Thread Deleted Successfully..!", {
        description : "You now can't recover that thread.",
        action: {
          label: "ok",
          onClick: () => {},
        },
      })
      dispatch(onClose());
      router.push(`/connections/${data?.connectionId}`);
      router.refresh();
      setModelOpen(false);
      
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
            <DialogTitle className="text-2xl text-center font-bold">Delete Thread</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure You want to Delete #<span className=" font-semibold text-red-500">{data?.thread?.name}</span>
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

export default DeleteThread;