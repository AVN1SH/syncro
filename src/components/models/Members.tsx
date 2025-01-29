"use client"
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { onClose, onOpen } from "@/features/modelSlice"
import { Check, Crown, Loader2, MoreVertical, Shield, Skull, User, UserRound, UserRoundPen, UserRoundX } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"
import { ScrollArea } from "../ui/scroll-area"
import UserAvatar from "../UserAvatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGavel, faShield, faShieldDog, faUserShield } from "@fortawesome/free-solid-svg-icons"
import { DBMember } from "@/types"
import { useRouter } from "next/navigation";

const roleIconMap = {
  "guest" : null,
  "moderator" : <Skull className="h-4 w-4 ml-2 text-yellow-500" />,
  "admin" : <Crown className="h-4 w-4 ml-2 text-rose-500" />,
}

const Members = () => {
  const { isOpen, type, data } = useSelector((state : RootState) => state.createConnectionSlice);
  const [loadingId, setLoadingId] = useState('');
  const isModelOpen = isOpen && type === "members";
  const [modelOpen, setModelOpen] = useState(isModelOpen);
  const connectionId = data?.connectionId;
  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    if(isOpen && type === "members") {
      setModelOpen(true);
    }
  }, [isOpen]);

  const handleOpenChange = () => {
      dispatch(onClose());
      setModelOpen(false);
  };

  const onRoleChange = async (memberId : string, newRole : DBMember["role"]) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/connections/members/${memberId}`,
        query: {
          connectionId        }
      });
      const response = await axios.patch(url, { newRole });
      router.refresh();
      dispatch(onOpen({
        type : "members",
        data : {
          connectionId,
          connectionMembers : response.data,
          connectionUserId : data.connectionUserId
        }
      }))
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  }

  const onKick = async (memberId : string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/connections/members/${memberId}`,
        query: {
          connectionId        }
      });

      const response = await axios.delete(url);

      router.refresh();
      dispatch(onOpen({
        type : "members",
        data : {
          connectionId,
          connectionMembers : response.data,
          connectionUserId : data.connectionUserId
        }
      }))
    } catch (error) {
      console.log(error);
    } finally { setLoadingId(''); }
  }

  return (
    <div>
      <Dialog open={modelOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-white text-black overflow-hidden focus:outline-none dark:bg-neutral-800">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold dark:text-white">Manage Members</DialogTitle>
            <DialogDescription
              className="text-center font-semibold dark:text-zinc-400 text-zinc-500"
            >
              {data?.connectionMembers?.length} Members
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {data?.connectionMembers?.map((member) => (
              <div key={member._id.toString()} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.user.imageUrl} user={member} />
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center gap-x-1 dark:text-white">
                    {member.user.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs dark:text-zinc-400 text-zinc-500">{member.user.email}</p>
                </div>
                {data.connectionUserId && String(data.connectionUserId) !== String(member.user._id) && loadingId !== String(member._id) && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger onClick={(e)=>e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left" align="end" forceMount className="dark:bg-neutral-900">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center hover:cursor-pointer">
                            <UserRoundPen className="h-4 w-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="dark:bg-neutral-900 focus:bg-neutral-950">
                              <DropdownMenuItem
                                className="hover:cursor-pointer"
                                onClick={() => onRoleChange(String(member._id), "guest")}
                              >
                                <UserRound className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "guest" && (
                                  <Check className="h-4 w-4 ml-auto text-yellow-500" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="hover:cursor-pointer"
                                onClick={() => onRoleChange(String(member._id), "moderator")}
                              >  
                                <Skull className="mr-2 text-xl"/>
                                Moderator
                                {member.role === "moderator" && (
                                  <Check className="h-4 w-4 ml-auto text-yellow-500" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="hover:cursor-pointer"
                          onClick={() => onKick(String(member._id))}
                        >
                          <UserRoundX className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                {loadingId === String(member._id) && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                )}
              </div>
            ))}
            
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Members;
