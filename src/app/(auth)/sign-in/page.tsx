"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signIn";
// import { useDebounceCallback } from "usehooks-ts"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { Loader2, Lock, LockOpen, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { signIn, useSession } from "next-auth/react"
import { ModeToggle } from "@/components/themeToggle"
import { Separator } from "@/components/ui/separator";


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
  const [animate, setAnimate] = useState(true);

  const { data: session, status } = useSession();

  useEffect(() => {
    if(status === "authenticated") router.push("/connections");
  }, [status, router]);

  const navigateWithAnimation = (path: string) => {
    setAnimate(true); 
    setTimeout(() => {
      router.push(path); 
    }, 300);
  };

  useEffect(() => {
    setTimeout(() => {
      setAnimate(false);
    }, 50);
  }, [])

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
    <div className="h-screen flex flex-col relative">
      <div className="flex justify-between px-3 py-2">
        <div className="flex items-center gap-2 dark:bg-zinc-900 bg-zinc-100 p-2 rounded-lg font-bold group duration-300 cursor-pointer text-black dark:text-white">
          <RefreshCw className="text-yellow-500 group-hover:animate-spin animate-[spin_10s_linear_infinite]"/>
          SyncRo
        </div>
        <ModeToggle />
      </div>

      <div className="flex justify-center flex-1 mx-24 my-6 bg-red-300 rounded-xl overflow-hidden sm:flex-col md:flex-row">
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center flex-col relative">
          <div className={`flex flex-col justify-center items-center 
          ${animate ? "opacity-0" : "opacity-100"} overflow-hidden duration-500 transition-all`}>
            <h1 className="flex items-center text-4xl gap-2 font-extrabold tracking-tight lg:text-5xl">
              Welcome Back
            </h1>
            <h3 className="font-bold text-lg mt-2 text-yellow-500">Log in to continue the conversation.🚀</h3>
            <p className="mb-4 text-sm mt-6">Sign-In To Your Account, If New <span onClick={() => navigateWithAnimation("/sign-up")} className="text-blue-500 underline hover:font-semibold cursor-pointer">Sign-Up</span></p>
          </div>

          <div className="w-[350px] max-w-xl">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className={`${animate ? "w-0 opacity-50" : "w-full opacity-100"} overflow-hidden duration-300 transition-all`}>
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
                    <FormItem className={`relative ${animate ? "w-0 opacity-50" : "w-full opacity-100"} overflow-hidden duration-300 transition-all`}>
                      <FormLabel>Password<span className="text-red-600">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          type={viewPassword ? "text" : "password"} 
                          placeholder="eg : ABcde123@#" 
                          {...field} 
                        />
                      </FormControl>
                      <div
                        className="absolute top-9 right-4 hover:cursor-pointer"
                        onClick={() => setViewPassword(!viewPassword)}>
                          {!viewPassword && <Lock size={18}/>}
                          {viewPassword && <LockOpen size={18} />}
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                {error && <div className="text-red-500 font-bold ">{error}</div>}
                <Button type="submit" disabled={isSubmiting} className={`${animate ? "w-0 opacity-0" : "w-full opacity-100"} overflow-hidden duration-300 transition-all mt-6 bg-yellow-500`}>
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
          <div className={`mt-4 flex items-center gap-3
            ${animate ? "w-0" : "w-[300px] transition-all duration-700"}
          `}>
            <Separator className="flex-1 bg-zinc-300 rounded-full" />
            <p className={`${animate ? "opacity-0" : "opacity-100"} transition-all duration-300`}>OR</p>
            <Separator className="flex-1 bg-zinc-300 rounded-full" />
          </div>
          <div className={`relative w-fit mt-4 duration-500 transition-all 
          ${animate ? "-bottom-40" : "bottom-0"}`}>
            <div className="p-[2px] rounded-full overflow-hidden">
              <button className="relative bg-zinc-300 hover:bg-white rounded-full flex items-center gap-2 px-4 py-2 before:absolute before:w-[230px] before:h-[230px] before:left-[-10px] before:hover:animate-[spin_3s_linear_infinite] before:bg-gradient-to-r before:from-red-500 before:via-yellow-400 before:to-sky-500 before:rounded-full before:opacity-0 hover:before:opacity-100 before:duration-200 duration-500 before:z-[-10] z-0" 
              onClick={googleSubmit}
              ><img className="w-5 h-5 object-contain" src="/images/google.svg"/><span className="text-zinc-800 font-bold text-[16px] ">Sign-In with Google</span></button>
            </div>
          </div>
          <img src={"/images/sadEmoji.svg"} className={`absolute size-[200px] rotate-12 drop-shadow-[0px_0px_10px_rgb(241,167,16)] opacity-45 duration-300 transition-all
          ${animate ? "-left-40 -bottom-48" : "-left-16 -bottom-16"}
          `} />
          <img src="/images/yellowSmile.svg" className={`absolute size-[200px] -rotate-12 drop-shadow-[0px_0px_10px_rgb(241,167,16)] opacity-25 duration-300 transition-all
          ${animate ? "-right-40 -bottom-48" : "-right-12 -bottom-12"}
          `} />
          <div className="absolute top-8 left-0 text-yellow-500 flex">
            ---------------------
            <div className="animate-bounce">😁</div>
          </div>
        </div>

        <div className="flex-1 bg-yellow-500 flex flex-col relative z-0">
          <div className="flex flex-col px-10 py-6 dark:text-black text-white">
            <h1 className={`relative font-black text-4xl transition-all duration-300 ${animate ? "-right-[800px]" : "right-0"}`}>WELCOME BACK TO </h1>
            <div className={`flex items-center gap-2 relative transition-all duration-700 ${animate ? "-right-[800px]" : "right-0"}`}>
              <h1 className="flex items-center w-fit p-2 gap-2 dark:bg-zinc-800 bg-zinc-100 rounded-lg font-black text-4xl shadow-lg">
                <RefreshCw className="size-[34px] text-yellow-500 animate-[spin_10s_linear_infinite]" />
                <span className="text-black dark:text-white">SyncRo!</span>
              </h1>
              <p className="text-4xl animate-wave">👋</p>
            </div>
          </div>

          <p className={`px-10 dark:text-zinc-700/85 text-white/85 text-xl ${animate ? "opacity-0" : "opacity-100"} transition-all duration-300`}>
            Reconnect with your 
            <span className="font-semibold text-white dark:text-zinc-700"> community</span>
            , engage in 
            <span className="font-semibold text-white dark:text-zinc-700"> real-time </span>
            conversations, and stay updated with everything that matters. Whether it's 
            <span className="font-semibold text-white dark:text-zinc-700"> chat</span>, 
            <span className="font-semibold text-white dark:text-zinc-700"> voice</span>, or 
            <span className="font-semibold text-white dark:text-zinc-700"> video</span> – Syncro keeps you connected effortlessly. 
            <span className="font-semibold text-white dark:text-zinc-700"> Log in now</span> and continue where you left off!
          </p>
          <img src="/images/hash3.svg" className={`absolute -bottom-24 w-full opacity-25 drop-shadow-xl z-[-1] ${animate ? "h-0" : "h-full"} duration-300 transition-all`}/>
        </div>
        <div className="flex-0 transition-all"></div>
      </div>
      <div className="absolute bg-zinc-800 drop-shadow-[0px_0px_10px_rgba(0,0,0)] size-[68px] rounded-full bottom-0 left-16 -z-10" />
      <div className="absolute bg-zinc-800 drop-shadow-[0px_0px_10px_rgba(0,0,0)] size-[68px] rounded-full top-14 right-16 -z-10" />
    </div>
  )
}

export default page