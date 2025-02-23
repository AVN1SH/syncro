import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await currentUser();

  if(!user) redirect("/sign-in");

  if(user) redirect("/chat")

  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}