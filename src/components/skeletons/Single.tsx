import { Skeleton } from "../ui/skeleton"

const Single = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-10 rounded-full dark:bg-zinc-700 bg-zinc-100" />
      <Skeleton className="h-6 w-[calc(100%-80px)] rounded-full dark:bg-zinc-700 bg-zinc-100" />
    </div>
  )
}

export default Single
