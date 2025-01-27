"use client"
import { z } from "zod"
import qs from "query-string"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { 
  Form,
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../ui/form"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { onClose } from "@/features/modelSlice"
import { useParams, useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { newThread, threadType } from "@/schemas/thread"

const CreateThread = () => {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { isOpen, type } = useSelector((state : RootState) => state.createConnectionSlice);
  const isModelOpen = isOpen && type === "createThread";
  const [modelOpen, setModelOpen] = useState(isModelOpen);
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();


  const form = useForm<z.infer<typeof newThread>>({
    resolver: zodResolver(newThread),
    defaultValues: {
      name: '',
      type: "text"
    }
  });

  const onSubmit = async (values: z.infer<typeof newThread>) => {
    setIsSubmitting(true);
    console.log(params)
    try {
      const url = qs.stringifyUrl({
        url: "/api/threads/new-thread",
        query: {
          connectionId: params?.id,
        },
      });
      const response = await axios.post(url, {
        name: values.name,
        type: values.type,
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
      setIsSubmitting(false);
      form.reset();
      router.refresh();
      dispatch(onClose());
      setModelOpen(false);
    } catch (error : any) {
      if(Number(error.message) >= 400) {
        if(error.message === '409') setError("Connection Already Exists");
        else setError("Something went wrong");
      }
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if(isOpen && type === "createThread") {
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
        <DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-neutral-800 dark:text-white">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Create New Thread</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col justify-center gap-4 py-4 px-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-zinc-600 dark:text-zinc-300">THREAD NAME<span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="Name For Your Thread" 
                        {...field} 
                        className="border-0 bg-zinc-200 dark:bg-zinc-700"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      You can't change name after creating a connection.
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name = "type"
                render = {({field}) => (
                  <FormItem>
                    <FormLabel>Thread Type</FormLabel>
                    <Select
                      disabled={isSubmiting}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                        >
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="dark:bg-zinc-800 bg-zinc-200">
                        {Object.values(threadType).map((type) => (
                            <SelectItem key={type} value={type} className="capitalize dark:hover:bg-zinc-900 hover:bg-zinc-400 cursor-pointer">
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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
                  "Create Thread"
                )
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateThread;
