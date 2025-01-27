"use client"

import CreateConnection from "@/components/models/CreateConnection";
import StoreProvider from "@/store/StoreProvider";
import { useEffect, useState } from "react";
import Invite from "@/components/models/Invite";
import EditConnection from "@/components/models/EditConnection";
import Members from "@/components/models/Members";
import CreateThread from "@/components/models/CreateThread";

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
      </StoreProvider>
    </div>
  )
}

export default ModelProvider;
