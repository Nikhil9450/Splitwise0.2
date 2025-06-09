import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  modalContent: {
    modalHeader: "",
    modalBody: "",
    modalFooter: "",
  },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.modalContent = {
        modalHeader: action.payload?.modalHeader || "",
        modalBody: action.payload?.modalBody || "",
        modalFooter: action.payload?.modalFooter || "",
      };
    },
    closeModal: (state) => {
      state.isOpen = false;

      setTimeout(()=>{
        state.modalContent = {
        modalHeader: "",
        modalBody: "",
        modalFooter: "",
      };
      },1000)
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
