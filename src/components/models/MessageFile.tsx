"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { 
  Form,
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormMessage 
} from "../ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import FileUpload from "../FileUpload"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { onClose } from "@/features/modelSlice"
import { useRouter } from "next/navigation"
import { messageFile } from "@/schemas/messageFile"
import qs from "query-string";

const MessageFile = () => {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { isOpen, type, data } = useSelector((state : RootState) => state.createConnectionSlice);
  const dispatch = useDispatch();
  const router = useRouter();

  const isModelOpen = isOpen && type === "messageFile"
  const [modelOpen, setModelOpen] = useState(isModelOpen);


  const form = useForm<z.infer<typeof messageFile>>({
    resolver: zodResolver(messageFile),
    defaultValues: {
      fileUrl: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof messageFile>) => {
    setIsSubmitting(true);
    try {
      const url = qs.stringifyUrl({
        url : data?.apiUrl || '',
        query : data?.query
      })
      const response = await axios.post(url, {
        ...values,
        content : values.fileUrl
      });

      if(response) {
        setError('');
        toast("Connection Created Successfully..!", {
          description : "Now you can start sharing your thoughts with your friends.",
          action: {
            label: "ok",
            onClick: () => console.log(''),
          },
        })
      }
      form.reset();
      dispatch(onClose());
      setModelOpen(false);
      setIsSubmitting(false);
    } catch (error : any) {
      if(Number(error.message) >= 400) {
        if(error.message === '409') setError("Connection Already Exists");
        else setError("Something went wrong");
      }
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if(isOpen && type === "messageFile") {
      setModelOpen(true);
    }
  }, [isOpen]);


  const handleClose = () => {
    form.reset();
    dispatch(onClose());
    setModelOpen(false);
  }
  return (
    <div>
      <Dialog open={modelOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          {/* {children} */}
        </DialogTrigger>
        <DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-neutral-800 dark:text-white">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Add Your Attachment</DialogTitle>
            <DialogDescription className="text-center text-zinc-500 dark:text-zinc-400">
              Send a file as a message.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col justify-center gap-4 py-4 px-6">
              <FormField
                name="fileUrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload 
                        endpoint="messageFile"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter className="bg-slate-200 px-6 py-4 dark:bg-zinc-700">
          {error && <div className="text-red-500 font-bold ">{error}</div>}
          <Button 
            type="submit" 
            disabled={isSubmiting} 
            className="w-full md:w-fit bg-yellow-500 hover:bg-yellow-600 dark:text-white"
            onClick={() => onSubmit(form.getValues())}
          >
              {
                isSubmiting ? (
                  <><Loader2 className="mr-2 h4 w4 animate-spin"/> Please wait</>
                ) : (
                  "Send"
                )
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MessageFile