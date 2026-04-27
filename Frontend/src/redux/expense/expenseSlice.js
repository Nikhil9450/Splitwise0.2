import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

export const addExpense = createAsyncThunk("expense/addExpense",async(data,thunkAPI)=>{
    console.log('data inside the addExpense thunk---------->',data);
    console.log('groupid inside the addExpense thunk---------->',data.group);
    try {
        const response=  await axios.post(`${API_URL}expense/addExpense`,{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchGroupExpenses(data.group));
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to add expense"
        );
    }
})

export const updateExpense = createAsyncThunk("expense/updateExpense",async(data,thunkAPI)=>{
    console.log('data inside the addExpense thunk---------->',data);
    console.log('groupid inside the addExpense thunk---------->',data.group);
    try {
        const response=  await axios.post(`${API_URL}expense/updateExpense`,{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchGroupExpenses(data.group));
        await thunkAPI.dispatch(fetchSingleExpense(data.expenseId));
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to add expense"
        );
    }
})

export const deleteExpense = createAsyncThunk("expense/deleteExpense",async(data,thunkAPI)=>{
    console.log('data inside the addExpense thunk---------->',data);
    console.log('groupid inside the addExpense thunk---------->',data.group);
    try {
        const response=  await axios.post(`${API_URL}expense/deleteExpense`,{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchGroupExpenses(data.group));
        await thunkAPI.dispatch(fetchSingleExpense(data.expenseId));
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to add expense"
        );
    }
})

export const fetchGroupExpenses = createAsyncThunk('expenses/fetchGroupExpenses',async(GroupId,thunkAPI)=>{
    console.log('GroupId inside the fetchGroupExpenses thunk---------->',GroupId);
    try {
        const response = await axios.get(`${API_URL}expense/fetchGroupExpenses`,{
            params:{'groupId':GroupId},
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

export const fetchSingleExpense = createAsyncThunk('expense/fetchExpenseDetails',async(expenseId,thunkAPI)=>{
    console.log("expense Id insde fetchSingleExpense",expenseId);
    try {
        const response = await axios.get(`${API_URL}expense/fetchExpenseDetails`,{
            params:{'expenseId':expenseId},
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
const expenseSlice = createSlice({
    name:'expense',
    initialState:{
        expense:[],
        expenseDetail:"",
        addResponse:"",
        status: 'idle',
        error: null,
        mutationStatus: "idle", // loading | succeeded | failed
        mutationType: null, // "add" | "update" | "delete"
        mutationError: null,

        fetchExpenseStatus: 'idle',
        fetchExpenseError: null,
        fetchSingleExpenseStatus: 'idle',
        fetchSingleExpenseError: null,
    },
    reducers: {
            resetMutationState: (state) => {
                state.mutationStatus = "idle";
                state.mutationType = null;
                state.mutationError = null;
            }
        },
    extraReducers: (builder)=>{
        builder 
            .addCase(addExpense.pending, (state) => {
                state.mutationStatus = "loading";
                state.mutationType = "add";
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.addResponse = action.payload;
                state.mutationStatus = "succeeded";
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.mutationError = action.payload;
                state.mutationStatus = "failed";
            })

            .addCase(deleteExpense.pending, (state) => {
                state.mutationStatus = "loading";
                state.mutationType = "delete";
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.addResponse = action.payload;
                state.mutationStatus = "succeeded";
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.mutationError = action.payload;
                state.mutationStatus = "failed";
            })

            .addCase(updateExpense.pending, (state) => {
                state.mutationStatus = "loading";
                state.mutationType = "update";
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                state.addResponse = action.payload;
                state.mutationStatus = "succeeded";
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.mutationError = action.payload;
                state.mutationStatus = "failed";
            })

            .addCase(fetchGroupExpenses.pending,(state)=>{
                state.fetchExpenseStatus="loading"
            })
            .addCase(fetchGroupExpenses.fulfilled,(state,action)=>{
                state.expense=action.payload;
                state.fetchExpenseStatus='succeeded';
            })
            .addCase(fetchGroupExpenses.rejected,(state,action)=>{
                state.fetchExpenseError= action.payload || "Fetching list failed";
                state.fetchExpenseStatus='failed';
                state.expense=[];
            })

            .addCase(fetchSingleExpense.pending,(state)=>{
                state.fetchSingleExpenseStatus="loading"
            })
            .addCase(fetchSingleExpense.fulfilled,(state,action)=>{
                state.expenseDetail=action.payload;
                state.fetchSingleExpenseStatus='succeeded';
            })
            .addCase(fetchSingleExpense.rejected,(state,action)=>{
                state.fetchSingleExpenseError= action.payload || "Fetching expense failed.";
                state.fetchSingleExpenseStatus='failed';
                state.expenseDetail="";
            })

    }
})
export const { resetMutationState } = expenseSlice.actions;
export default expenseSlice.reducer;