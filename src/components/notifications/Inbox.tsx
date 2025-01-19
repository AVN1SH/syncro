import { faInbox, faQuestionCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ActionTooltip from "../action-tooltip"
import { Separator } from "../ui/separator"

const Inbox = () => {
  return (
    <div className="pr-4 flex items-center gap-6">
      <Separator className="mx-2 h-[calc(100%-20px)] bg-zinc-300 dark:bg-zinc-700 rounded-md w-[2px] my-auto"/>
      <ActionTooltip side="top" label="Inbox">
        <button className="">
          <FontAwesomeIcon icon={faInbox} size="xl" className="text-zinc-400 hover:text-white duration-150" />
        </button>
      </ActionTooltip>
      <ActionTooltip side="top" label="Help">
        <button>
          <FontAwesomeIcon icon={faQuestionCircle} size="xl" className="text-zinc-400 hover:text-white duration-150" />
        </button>
      </ActionTooltip>
    </div>
  )
}

export default Inbox
