import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

export const fetchActivities = createAsyncThunk('activity/fetchActivities', async (groupId) => {
    console.log('Fetching activities for groupId:', groupId);
    try {
        const response = await axios.get(`${API_URL}activity/${groupId}/activities`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch activities');
    }
});
export const addActivity = createAsyncThunk('activity/addActivity', async ({ groupId, action, details }, thunkAPI) => {
    console.log('Adding activity for groupId:', groupId, 'Action:', action, 'Details:', details);
    try {
        const response = await axios.post(`${API_URL}activity/${groupId}/activities`, { action, details }, { withCredentials: true });
        thunkAPI.dispatch(fetchActivities(groupId));
        return response.data;
    } catch (error) {
        throw new Error('Failed to add activity');
    }
});


const activitySlice = createSlice({ 
    name:'activity',
    initialState:{
        activities:[],
        loading:false,
        error:null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchActivities.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchActivities.fulfilled, (state, action) => {
                state.loading = false;
                state.activities = action.payload;
            })
            .addCase(fetchActivities.rejected, (state) => {
                state.loading = false;
                state.error = 'Failed to fetch activities';
            })
            .addCase(addActivity.pending, (state) => {
                state.loading = true;
            })
            .addCase(addActivity.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addActivity.rejected, (state) => {
                state.loading = false;
                state.error = 'Failed to add activity';
            });


    }

});
export default activitySlice.reducer;