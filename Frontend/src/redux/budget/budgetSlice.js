import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

export const addBudget = createAsyncThunk("Budget/addBudget",async(data,thunkAPI)=>{
    console.log('data inside the addBudget thunk---------->',data);
    try {
        const response=  await axios.post(`${API_URL}Budget/addBudget`,{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchAllBudget());
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to add expense"
        );
    }
})

export const updateBudget = createAsyncThunk("Budget/updateBudget",async(data,thunkAPI)=>{
    console.log('data inside the updateBudget thunk---------->',data);
    try {
        const response=  await axios.post(`${API_URL}Budget/updateBudget`,{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchAllBudget());
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to update expense"
        );
    }
})

export const deleteBudget = createAsyncThunk("Budget/deleteBudget",async(data,thunkAPI)=>{
    console.log('data inside the deleteBudget thunk---------->',data);
    const payload = {expenseId: data};
    try {
        const response=  await axios.post(`${API_URL}Budget/deleteBudget`,{payload},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchAllBudget());
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to delete expense"
        );
    }
})
export const fetchAllBudget = createAsyncThunk('Budget/fetchAllBudget',async(thunkAPI)=>{
    try {
        const response = await axios.get(`${API_URL}Budget/fetchAllBudgets`,{
            withCredentials:true
        })
        console.log("response---------->",response.data) 
       
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to fetch expense"
        );
    }
})
const budgetSlice = createSlice({
    name:'budget',
    initialState:{
        apiResponse:"",
        budgets:[],
        status: 'idle',
        error: null,
        budgetMutationStatus: "idle", // loading | succeeded | failed
        budgetMutationType: null, // "add" | "update" | "delete"
        budgetMutationError: null,
    },
    reducers: {
            resetBudgetMutationState: (state) => {
                state.budgetMutationStatus = "idle";
                state.budgetMutationType = null;
                state.budgetMutationError = null;
            },
            resetBudgetStatus: (state) => {
                state.status = 'idle';
                state.error = null;
            }
        },
    extraReducers: (builder)=>{
        builder 
            .addCase(addBudget.pending, (state) => {
                state.budgetMutationStatus = "loading";
                state.budgetMutationType = "add";
            })
            .addCase(addBudget.fulfilled, (state, action) => {
                state.apiResponse = action.payload;
                state.budgetMutationStatus = "succeeded";
            })
            .addCase(addBudget.rejected, (state, action) => {
                state.budgetMutationError = action.payload;
                state.budgetMutationStatus = "failed";
            })

            .addCase(deleteBudget.pending, (state) => {
                state.budgetMutationStatus = "loading";
                state.budgetMutationType = "delete";
            })
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.apiResponse = action.payload;
                state.budgetMutationStatus = "succeeded";
            })
            .addCase(deleteBudget.rejected, (state, action) => {
                state.budgetMutationError = action.payload;
                state.budgetMutationStatus = "failed";
            })

            .addCase(updateBudget.pending, (state) => {
                state.budgetMutationStatus = "loading";
                state.budgetMutationType = "update";
            })
            .addCase(updateBudget.fulfilled, (state, action) => {
                state.apiResponse = action.payload;
                state.budgetMutationStatus = "succeeded";
            })
            .addCase(updateBudget.rejected, (state, action) => {
                state.budgetMutationError = action.payload;
                state.budgetMutationStatus = "failed";
            })

            .addCase(fetchAllBudget.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllBudget.fulfilled, (state, action) => {
                state.budgets = action.payload;
                state.status = "succeeded";
            })
            .addCase(fetchAllBudget.rejected, (state, action) => {
                state.error = action.payload;
                state.status = "failed";
            })

    }
})
export const { resetBudgetMutationState, resetBudgetStatus } = budgetSlice.actions;
export default budgetSlice.reducer;