import { DBThread, MemberWithUser } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import mongoose from "mongoose";

export type ConnectionType = "createConnection" | "invite" | "editConnection" | "members" | "createThread" | "leaveConnection" | "deleteConnection" | "deleteThread" | "editThread" | "uploadBanner" | "messageFile" | "deleteMessage" | "friendRequest" | "";

interface ConnectionData {
  connectionId ?: string;
  inviteCode ?: string;
  profilePhotoUrl ?: string;
  connectionName ?: string;
  connectionBannerPhotoUrl ?: string;
  connectionMembers ?: MemberWithUser[];
  connectionUserId ?: mongoose.Schema.Types.ObjectId;
  threadType ?: DBThread["type"];
  thread ?: DBThread;
  apiUrl ?: string;
  query ?: Record<string, any>;
}

export interface CreateConnection {
  isOpen : boolean;
  type : ConnectionType;
  data  : ConnectionData;
  onOpen ?: (type : ConnectionType, data? : ConnectionData) => void; 
  onClose ?: () => void; 
}

const initialState : CreateConnection = {
  isOpen : false,
  type : '',
  data : {}
}

const createConnectionSlice = createSlice({
  name : "createConnection",
  initialState,
  reducers : {
    onOpen : (state, action) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data;
    },
    onClose : (state) => {
      state.isOpen = false;
      state.type = '';
      state.data = {};
    }
  }
});

export const { onOpen, onClose } = createConnectionSlice.actions;
export default createConnectionSlice.reducer;