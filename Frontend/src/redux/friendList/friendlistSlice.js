import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFriendLists = createAsyncThunk('friend/fetchFriendList',async(_,thunkAPI)=>{
    try{
        const res = await axios.get("http://localhost:5000/friendLists",{withCredentials:true})
        console.log("res------------------>",res.data.result);
        return res.data.result;
    }catch(error){
        console.log("error------------------>",error);
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "Failed to fetch friend list"
        );
    }
})

const friendListSlice= createSlice({
    name:'friendList',
    initialState:{
        recievedRequests:[],
        sentRequests:[],
        friends:[],
        status:'idle',
        error:null,
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchFriendLists.pending,(state)=>{
                state.status="loading";
            })
            .addCase(fetchFriendLists.fulfilled,(state,action)=>{
                state.recievedRequests=action.payload.friendRequestsReceived;
                state.sentRequests=action.payload.friendRequestsSent;
                state.friends=action.payload.friends;
                state.status='succeeded';
            })
            .addCase(fetchFriendLists.rejected,(state,action)=>{
                state.recievedRequests=null;
                state.sentRequests=null;
                state.friends=null;
                state.status='failed';
                state.error=action.payload || 'Fetching List failed';
            })            
    }
})

export default friendListSlice.reducer;