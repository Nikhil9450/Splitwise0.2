import { createSlice ,createAsyncThunk, isRejected} from "@reduxjs/toolkit";
import axios from "axios";

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
    try {
        const res = await axios.get('http://localhost:5000/checkAuth', { withCredentials: true });
        console.log("checkAuth response---->", res);
        return { isAuthenticated: res.data.isAuthenticated, role: res.data.role };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to check auth");
    }
});

export const logout = createAsyncThunk('auth/logoutUser',async()=>{
    const res = await axios.post('http://localhost:5000/user/logout',{},{withCredentials:true});
    return res.data.loggedIn;
})
const authSlice = createSlice({
    name:'auth',
    initialState:{
        isAuthenticated:null,
        userRole:null,
        status:'idle',
        error:null,
    },
    extraReducers:(builder)=>{
        builder
            .addCase(checkAuth.pending,(state)=>{
                state.status='loading';
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
                state.userRole=action.payload.role
                state.status = 'succeeded';
            })
            .addCase(checkAuth.rejected, (state) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.userRole=null;
            })
            //logout User
            .addCase(logout.pending, (state) => {
                state.status = 'loggingOut';
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload; // expected to be false
                state.status = 'idle';
            })
            .addCase(logout.rejected, (state, action) => {
                state.status = 'logoutFailed';
                state.error = action.error.message;
            });
    }
})

export default authSlice.reducer; 