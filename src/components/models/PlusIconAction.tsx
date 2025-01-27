import { Plus } from "lucide-react"
import ActionTooltip from "../action-tooltip"

interface Props {
  label: string;
  name : string;
}

const PlusIconAction = ({name, label} : Props) => {
  return (
    <div className="p-2 text-zinc-400 text-sm flex items-center justify-between w-full">
      <span className="">{name}</span>
      <ActionTooltip label={label}>
        <Plus size={16} className="text-yellow-500 hover:cursor-pointer hover:text-yellow-600" />
      </ActionTooltip>
    </div>
  )
}

export default PlusIconAction
