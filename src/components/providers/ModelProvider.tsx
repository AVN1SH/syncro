"use client"

import CreateConnection from "@/components/models/CreateConnection";
import StoreProvider from "@/store/StoreProvider";
import { useEffect, useState } from "react";
import Layout from "@/app/layout"
import Invite from "@/components/models/Invite";
import EditConnection from "@/components/models/EditConnection";

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
      </StoreProvider>
    </div>
  )
}

export default ModelProvider;
