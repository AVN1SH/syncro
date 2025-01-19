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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signIn";
// import { useDebounceCallback } from "usehooks-ts"
import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faGraduationCap, faMessage, faRotate } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import { signIn, useSession } from "next-auth/react"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { currentUser } from "@/lib/currentUser"


const page = () => {
  // const [email, setEmail] = useState('');
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  // const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const session = useSession();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      }).then((res) => {
        if(res?.error) {
          setError(res.error);
        } else {
          toast("Signed In Successfully", {
            description : "Now you can start using our services",
            action: {
              label: "ok",
              onClick: () => console.log(''),
            },
          })
          router.push("/connections");
        }
      })
      setIsSubmitting(false);
    } catch (error : any) {
      setError("Error while signning you in, Please Try Again Or Do It Later");
      console.log(error);
      setIsSubmitting(false);
    }
  }

  const googleSubmit = async() => {
    setGoogleSubmitting(true);
    try {
      const response = await signIn("google", {
        redirect: false,
      }).then((res) => {
        console.log(session);

        if(res?.error) {
          setError(res.error);
        } else {
          router.push("/connections");
        }
      })
      setGoogleSubmitting(false);
    } catch (error : any) {
      setError("Error while signning you in, Please Try Again Or Do It Later");
      console.log(error);
      setGoogleSubmitting(false);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[400px] max-w-xl p-2 md:p-8 space-y-2 rounded-lg shadow-md my-3 mt-10 m-2">
        <div className="flex flex-col justify-center items-center">
          <h1 className="flex items-center text-4xl gap-2 font-extrabold tracking-tight lg:text-5xl">
            <FontAwesomeIcon icon={faRotate} color="white" className="bg-slate-800 rounded-full p-3"/> SyncRo..!
          </h1><h3 className="font-bold text-lg mt-2 text-purple-600">Let's Sync Together.</h3>
          <p className="mb-4 text-sm mt-6">Sign-In To Your Account, If New <Link href={"/sign-up"} className="text-blue-500 underline hover:font-semibold">Sign-Up</Link></p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="eg : example@example.com" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative flex-1">
                  <FormLabel>Password<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type={viewPassword ? "text" : "password"} 
                      placeholder="eg : ABcde123@#" 
                      {...field} 
                    />
                  </FormControl>
                  <div
                    className="absolute top-8 right-4 hover:cursor-pointer"
                    onClick={() => setViewPassword(!viewPassword)}>
                      {!viewPassword && <FontAwesomeIcon icon={faEye} />}
                      {viewPassword && <FontAwesomeIcon icon={faEyeSlash} />}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {error && <div className="text-red-500 font-bold ">{error}</div>}
            <Button type="submit" disabled={isSubmiting} className="bg-purple-700 rounded">
              {
                isSubmiting ? (
                  <><Loader2 className="mr-2 h4 w4 animate-spin"/> Please wait</>
                ) : (
                  "Sign-In"
                )
              }
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-100px">
        <div className="p-[2px] rounded-full overflow-hidden">
          <button className="relative bg-slate-200 hover:bg-white rounded-full flex items-center gap-2 px-4 py-2 before:absolute before:w-[230px] before:h-[230px] before:left-[-10px] before:hover:animate-[spin_3s_linear_infinite] before:-z-10 before:bg-gradient-to-r before:from-red-500 before:via-yellow-400 before:to-sky-500 before:rounded-full before:opacity-0 hover:before:opacity-100 before:duration-200 duration-500" 
          onClick={googleSubmit}
          ><img className="w-5 h-5 object-contain" src="/images/google.svg"/><span className="text-slate-600 font-bold text-[16px] ">Sign-In with Google</span></button>
        </div>
      </div>
    </div>
  )
}

export default page
