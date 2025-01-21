"use client"

import CreateConnection from "@/components/models/CreateConnection";
import StoreProvider from "@/store/StoreProvider";
import { useEffect, useState } from "react";
import Invite from "@/components/models/Invite";
import EditConnection from "@/components/models/EditConnection";
import Members from "@/components/models/Members";

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
      </StoreProvider>
    </div>
  )
}

export default ModelProvider;
