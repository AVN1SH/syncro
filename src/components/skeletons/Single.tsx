import { Skeleton } from "../ui/skeleton"

const Single = () => {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-10 w-10 rounded-full bg-zinc-700" />
      <Skeleton className="h-6 w-[calc(100%-80px)] rounded-full bg-zinc-700" />
    </div>
  )
}

export default Single
