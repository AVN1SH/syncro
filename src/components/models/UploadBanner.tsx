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
  FormLabel, 
  FormMessage 
} from "../ui/form"
import { Input } from "@/components/ui/input"
import { newConnection } from "@/schemas/connection"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import FileUpload from "../FileUpload"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { onClose } from "@/features/modelSlice"
import { useRouter } from "next/navigation"
// import { useAppSelector } from "@/hooks/storeHooks"


const UploadBanner = () => {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const session = useSession();
  const { isOpen, type, data } = useSelector((state : RootState) => state.createConnectionSlice);
  const isModelOpen = isOpen && type === "uploadBanner";
  const [modelOpen, setModelOpen] = useState(isModelOpen);

  const dispatch = useDispatch();
  const router = useRouter();


  const form = useForm<z.infer<typeof newConnection>>({
    resolver: zodResolver(newConnection),
    defaultValues: {
      bannerPhotoUrl: '',
    }
  });

  useEffect(() => {
    if(data){
      form.setValue("name", data.connectionName || "");
      form.setValue("profilePhotoUrl", data.profilePhotoUrl);
    }
  }, [data, form])

  const onSubmit = async (values: z.infer<typeof newConnection>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.patch(`/api/connections/${data.connectionId}/uploadBanner`, {
        bannerPhotoUrl: values.bannerPhotoUrl
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

  const handleClose = () => {
    form.reset();
    dispatch(onClose());
    setModelOpen(false);
  }

  useEffect(() => {
    if(isOpen && type === "uploadBanner") {
      setModelOpen(true);
    }
  }, [isOpen]);

  return (
    <div>
      <Dialog open={modelOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden dark:bg-neutral-800 dark:text-white">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Upload Banner Image</DialogTitle>
            <DialogDescription className="text-center text-zinc-500 dark:text-zinc-400">
              You can always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col justify-center gap-4 py-4 px-6">
              <FormField
                name="bannerPhotoUrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload 
                        endpoint="connectionImage"
                        value={field.value}
                        onChange={field.onChange}
                        banner={true}
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
                  "Save Image"
                )
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UploadBanner;
