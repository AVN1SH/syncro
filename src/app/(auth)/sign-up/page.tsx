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
import { signUpSchema } from "@/schemas/signUp"
// import { useDebounceCallback } from "usehooks-ts"
import { useEffect, useState } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faGraduationCap, faMessage, faRotate } from "@fortawesome/free-solid-svg-icons"
import { toast } from "sonner"
import axios from "axios";


const page = () => {
  // const [email, setEmail] = useState('');
  const [isSubmiting, setIsSubmitting] = useState(false);
  // const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // const debounced = useDebounceCallback(setEmail, 300);
  

  // useEffect(() => {
  //   const checkEmail = async () => {
  //     if(email) {
  //       setIsCheckingEmail(true);
  //       try {
  //         //TODO: i need to add the request to the django
  //         setIsSubmitting(false);
  //       } catch(error) {
  //         // TODO:
  //         setIsSubmitting(false);
  //       }
  //     }
  //   }
  // }, [email])


  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name : '',
      username : '',
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", {
        name : values.name,
        username : values.username,
        email : values.email,
        password : values.password,
        confirmPassword : values.confirmPassword
      });
      if(response) {
        router.push("/log-in");
        setError('');
        toast("Registred Successfully..!", {
          description : "Login to Continue access your dashboard.",
          action: {
            label: "ok",
            onClick: () => console.log(''),
          },
        })
      }
      setIsSubmitting(false);
    } catch (error : any) {
      if(Number(error.message) >= 400) {
        if(error.message === '409') setError("Email Already Exist..! try different one")
        else setError("Error While Registration, Please Try Again Or Do It Later");
      }
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[500px] max-w-xl p-2 md:p-8 space-y-2 rounded-lg shadow-md my-3 mt-10 m-2">
        <div className="flex flex-col justify-center items-center">
          <h1 className="flex items-center text-4xl gap-2 font-extrabold tracking-tight lg:text-5xl">
            <FontAwesomeIcon icon={faRotate} color="white" className="bg-slate-800 rounded-full p-3"/> SyncRo..! 
          </h1><h3 className="font-bold text-lg mt-2 text-purple-600">Let's Sync Together.</h3>
          <p className="mb-4 text-sm mt-6">Sign-Up To Your Account, If Already <Link href={"/sign-in"} className="text-blue-500 underline hover:font-semibold">Sign-In</Link></p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name<span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="eg : Jhon" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Username<span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="eg : hello123" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Username can't change later.
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
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
                          // debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                      {/* {isCheckingEmail && <Loader2 className="animate-spin" />} */}
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Confirm Password<span className="text-red-600">*</span></FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-sm text-slate-500">Password must be at least 8 characters long and contains 
                      uppercase, lowercase, number and special character.</p>
            {error && <div className="text-red-500 font-bold ">{error}</div>}
            <Button type="submit" disabled={isSubmiting} className="bg-purple-700 rounded">
              {
                isSubmiting ? (
                  <><Loader2 className="mr-2 h4 w4 animate-spin"/> Please wait</>
                ) : (
                  "Sign-Up"
                )
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page
