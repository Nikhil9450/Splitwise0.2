import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchUserDetails = createAsyncThunk('user/fetchUserDetails',async (userId, thunkAPI) => {
    try {
        const res = await fetch(`http://localhost:5000/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const userData = await res.json();
        return userData;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});


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