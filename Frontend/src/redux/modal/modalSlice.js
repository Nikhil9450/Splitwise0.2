import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  modalType: "", // NEW: to identify which modal to show
  modalProps: {}, // NEW: to pass any required props
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
    state.isOpen = true;
    state.modalType = action.payload.modalType || "";
    state.modalProps = action.payload.modalProps || {};
    },
    closeModal: (state) => {
    state.isOpen = false;
    state.modalType = "";
    state.modalProps = {};
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
