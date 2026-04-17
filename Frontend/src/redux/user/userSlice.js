import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/findUserById`,
        { withCredentials: true }
      );
        console.log("fetchUserDetails response------>", res.data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


const userSlice=createSlice({
    name:'user',
    initialState:{
        user : null,
        status:null
    },
    reducers:{
        setuser:(state,action)=>{
          state.user = action.payload
        },
    },
    extraReducers:(builder)=>{
            builder
                .addCase(fetchUserDetails.pending, (state) => { 
                    state.status = 'loading';
                })
                .addCase(fetchUserDetails.fulfilled, (state, action) => {
                    state.user = action.payload;
                    state.status = 'succeeded';
                })
                .addCase(fetchUserDetails.rejected, (state, action) => {
                    state.status = 'failed';
                });
                    
        },
    })

export const {setuser}=userSlice.actions;
export { fetchUserDetails };
export default userSlice.reducer;