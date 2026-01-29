import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

 export const fetchUserGroups = createAsyncThunk('userGroup/fetchUserGroups',async(_,thunkAPI)=>{
        try{
           const response = await axios.post("http://localhost:5000/group/fetchUserGroups",{},{withCredentials:true});
           console.log("groupList----------------->",response.data)
           return response.data
        } catch(error) {
            console.log("error---------------->",error);
            return thunkAPI.rejectWithValue(
            error.response?.data?.error || "Failed to fetch friend list"
        );
        }
})


const userGroupSlice = createSlice({
    name:'userGroup',
    initialState:{
        UserGroupList:[],
        GroupDetails:[],
        status:'idle',
        error:null,
    },
    extraReducers:(builder)=>{
        builder
            .addCase(fetchUserGroups.pending,(state)=>{
                state.status='loading';
            })
            .addCase(fetchUserGroups.fulfilled,(state,action)=>{
                state.UserGroupList=action.payload;
                state.status='succeeded'
            })
            .addCase(fetchUserGroups.rejected,(state,action)=>{
                state.UserGroupList=null;
                state.status='failed'
            })
    }
    
})

export default userGroupSlice.reducer