import { Connection } from "@/model/connection.model";
import { createSlice } from "@reduxjs/toolkit";

type ConnectionType = "createConnection" | "invite" | "editConnection" | "";

interface ConnectionData {
  connectionId ?: string;
  inviteCode ?: string;
  profilePhotoUrl ?: string;
  connectionName ?: string;
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