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
import { useState } from "react"
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

interface Props {
  children? : React.ReactNode;
}

const CreateConnection = ({children} : Props) => {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const session = useSession();
  const { isOpen, type } = useSelector((state : RootState) => state.createConnectionSlice);
  const isModelOpen = isOpen && type === "createConnection";
  const dispatch = useDispatch();
  const router = useRouter();


  const form = useForm<z.infer<typeof newConnection>>({
    resolver: zodResolver(newConnection),
    defaultValues: {
      name: '',
      profilePhotoUrl: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof newConnection>) => {
    setIsSubmitting(true);
    try {
      console.log(session)
      const response = await axios.post("/api/new-connection", {
        name: values.name,
        profilePhotoUrl: values.profilePhotoUrl
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
    console.log(isModelOpen)
  }
  return (
    <div>
      <Dialog open={isModelOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">Customize your connection</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give you connection a name and a profile picture. You can always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col justify-center gap-4 py-4 px-6">
              <FormField
                name="profilePhotoUrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload 
                        endpoint="connectionImage"
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
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-zinc-600">CONNECTION NAME<span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="Name For Your Connection" 
                        {...field} 
                        className="border-0 bg-zinc-200"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      You can't change name after creating a connection.
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter className="bg-slate-200 px-6 py-4">
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
                  "Create Connection"
                )
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateConnection;
