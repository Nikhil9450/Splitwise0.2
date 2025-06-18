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

export const sendFriendRequest = createAsyncThunk('friend/sendFriendRequest',async(userID,thunkAPI)=>{
    try{
        const response = await axios.post('http://localhost:5000/sendFriendRequest',{toUserId:userID},{ withCredentials:true})
        console.log("response---------->",response.data)
        await thunkAPI.dispatch(fetchFriendLists());
    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "Failed to fetch friend list"
        );
    }
})
export const deleteFriendRequest = createAsyncThunk('friend/deleteFriendRequest',async(userID,thunkAPI)=>{
    try{
        const response = await axios.post('http://localhost:5000/deleteFriendRequest',{toUserId:userID},{ withCredentials:true})
        console.log("response---------->",response.data)
        await thunkAPI.dispatch(fetchFriendLists());
    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "Failed to delete friend request"
        );
    }
})
export const removeFriend = createAsyncThunk('friend/removeFriend',async(userID,thunkAPI)=>{
    console.log("removeFriend",userID)
    try{
        const response = await axios.post('http://localhost:5000/removeFriend',{toUserId:userID},{ withCredentials:true})
        console.log("response---------->",response.data)
        await thunkAPI.dispatch(fetchFriendLists());
    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "Failed to remove friend"
        );
    }
})
export const acceptFriendRequest = createAsyncThunk('friend/acceptFriendRequest',async(userID,thunkAPI)=>{
    console.log("accept friend request")
    try{
        const response = await axios.post('http://localhost:5000/acceptFriendRequest',{toUserId:userID},{ withCredentials:true})
        console.log("response---------->",response.data)
        await thunkAPI.dispatch(fetchFriendLists());
    }catch(error){
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "Failed to accept friend request"
        );
    }
})
const friendListSlice= createSlice({
    name:'friendList',
    initialState: {
        recievedRequests: [],
        sentRequests: [],
        friends: [],
        status: 'idle',
        error: null,

        sendStatus: 'idle',
        sendError: null,

        deleteStatus: 'idle',
        deleteError: null,

        acceptStatus: 'idle',
        acceptError: null,

        removeStatus: 'idle',
        removeError: null,
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
            // Send Friend Request
            .addCase(sendFriendRequest.pending, (state) => {
                state.sendStatus = 'loading';
                state.sendError = null;
            })
            .addCase(sendFriendRequest.fulfilled, (state) => {
                state.sendStatus = 'succeeded';
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.sendStatus = 'failed';
                state.sendError = action.payload || 'Failed to send friend request';
            })

            // Delete Friend Request
            .addCase(deleteFriendRequest.pending, (state) => {
                state.deleteStatus = 'loading';
                state.deleteError = null;
            })
            .addCase(deleteFriendRequest.fulfilled, (state) => {
                state.deleteStatus = 'succeeded';
            })
            .addCase(deleteFriendRequest.rejected, (state, action) => {
                state.deleteStatus = 'failed';
                state.deleteError = action.payload || 'Failed to delete friend request';
            })

            // Accept Friend Request
            .addCase(acceptFriendRequest.pending, (state) => {
                state.acceptStatus = 'loading';
                state.acceptError = null;
            })
            .addCase(acceptFriendRequest.fulfilled, (state) => {
                state.acceptStatus = 'succeeded';
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.acceptStatus = 'failed';
                state.acceptError = action.payload || 'Failed to accept friend request';
            })  
            // Remove Friend
            .addCase(removeFriend.pending, (state) => {
                state.removeStatus = 'loading';
                state.removeError = null;
            })
            .addCase(removeFriend.fulfilled, (state) => {
                state.removeStatus = 'succeeded';
            })
            .addCase(removeFriend.rejected, (state, action) => {
                state.removeStatus = 'failed';
                state.removeError = action.payload || 'Failed to remove friend';
            });                    
    }
})

export default friendListSlice.reducer;