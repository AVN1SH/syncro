"use client";

import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import { usePathname } from "next/navigation";

const ByLink = () => {
  const pathname = usePathname();
  return (
    <div className="mx-3 space-y-[2px] mt-3">
      <button 
        // onClick={onClick}
        className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", pathname?.includes("sender") ? "bg-zinc-700/20 dark:bg-zinc-700" : "bg-transparent")}
      >
        <Link className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <p className={cn("line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", pathname?.includes("sender") && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
          Generate Link
        </p>
      </button>
    </div>
  )
}

export default ByLink
