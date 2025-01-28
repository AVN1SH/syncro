"use client"

import CreateConnection from "@/components/models/CreateConnection";
import StoreProvider from "@/store/StoreProvider";
import { useEffect, useState } from "react";
import Invite from "@/components/models/Invite";
import EditConnection from "@/components/models/EditConnection";
import Members from "@/components/models/Members";
import CreateThread from "@/components/models/CreateThread";
import LeaveConnection from "@/components/models/LeaveConnection";
import DeleteConnection from "@/components/models/DeleteConnection";
import DeleteThread from "@/components/models/DeleteThread";

const ModelProvider = () => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!isMounted) {
    return null;
  }

  return (
    <div>
      <StoreProvider>
        <CreateConnection />
        <Invite />
        <EditConnection />
        <Members />
        <CreateThread />
        <LeaveConnection />
        <DeleteConnection />
        <DeleteThread />
      </StoreProvider>
    </div>
  )
}

export default ModelProvider;
