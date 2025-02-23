"use client";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Friends = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="mx-3">
      <div className={cn("group rounded-md flex items-center justify-between w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", pathname === "/chat" ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent cursor-pointer")}>
        <button 
          onClick={() => router.push("/chat")}
          className={"flex-1 pl-2 py-2 flex items-start justify-between"}
        >
          <div className="flex items-center gap-x-2">
            <Users className="text-amber-500" />
            <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", pathname === "/chat" && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
              Friends
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Friends