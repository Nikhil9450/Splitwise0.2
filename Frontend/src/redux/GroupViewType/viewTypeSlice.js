import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    viewType:"groups"
};

const viewTypeSlice = createSlice({
    name:"viewType",
    initialState,
    reducers:{
        setViewType:(state,action)=>{
            state.viewType=action.payload;
        }
    }
})

export const {setViewType} = viewTypeSlice.actions;
export default viewTypeSlice.reducer;