import { createSlice } from "@reduxjs/toolkit";

export interface CreateConnection {
  isOpen : boolean;
  type : string;
}

const initialState : CreateConnection = {
  isOpen : false,
  type : '',
}

const createConnectionSlice = createSlice({
  name : "createConnection",
  initialState,
  reducers : {
    onOpen : (state, action) => {
      state.isOpen = true;
      state.type = action.payload;
    },
    onClose : (state) => {
      console.log("hello2")
      state.isOpen = false;
      state.type = '';
    }
  }
});

export const { onOpen, onClose } = createConnectionSlice.actions;
export default createConnectionSlice.reducer;