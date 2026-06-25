import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

export const addPersonalExpense = createAsyncThunk("personalExpense/addPersonalExpense",async(data,thunkAPI)=>{
    console.log('data inside the addPersonalExpense thunk---------->',data);
    try {
        const response=  await axios.post(`${API_URL}personalExpense/addPersonalExpense`,{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchExpensesByMonthYear(data.date.format('MM-YYYY')));
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to add expense"
        );
    }
})

export const updatePersonalExpense = createAsyncThunk("personalExpense/updatePersonalExpense",async(data,thunkAPI)=>{
    console.log('data inside the updatePersonalExpense thunk---------->',data);
    console.log('groupid inside the updatePersonalExpense thunk---------->',data.group);
    try {
        const response=  await axios.post(`${API_URL}personalExpense/updatePersonalExpense`,{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchExpensesByMonthYear(data.date.format('MM-YYYY')));
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to update expense"
        );
    }
})

export const deletePersonalExpense = createAsyncThunk("personalExpense/deletePersonalExpense",async({expenseId,month_year},thunkAPI)=>{
    console.log('data inside the deletePersonalExpense thunk---------->',expenseId,month_year);
    try {
        const response=  await axios.post(`${API_URL}personalExpense/deletePersonalExpense`,{expenseId},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchExpensesByMonthYear(month_year));
        return response.data;       
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error.response?.data?.error || "failed to delete expense"
        );
    }
})
export const fetchAllPersonalExpenses = createAsyncThunk('personalExpense/fetchAllPersonalExpense',async(thunkAPI)=>{
    try {
        const response = await axios.get(`${API_URL}personalExpense/fetchAllPersonalExpense`,{
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
export const fetchExpensesByMonthYear = createAsyncThunk('personalExpense/fetchExpensesByMonthYear',async(month_year,thunkAPI)=>{
    console.log("month_year in fetchExpensesByMonthYear thunk---------->",month_year)
    try {
        const response = await axios.get(`${API_URL}personalExpense/fetchExpensesByMonthYear/${month_year}`,{
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
const personalExpenseSlice = createSlice({
    name:'personalExpense',
    initialState:{
        monthlyExpenses:[],
        monthlyTotal:0,
        apiResponse:"",
        status: 'idle',
        error: null,
        personalMutationStatus: "idle", // loading | succeeded | failed
        personalMutationType: null, // "add" | "update" | "delete"
        personalMutationError: null,
    },
    reducers: {
            resetPersonalExpenseMutationState: (state) => {
                state.personalMutationStatus = "idle";
                state.personalMutationType = null;
                state.personalMutationError = null;
            }
        },
    extraReducers: (builder)=>{
        builder 
            .addCase(addPersonalExpense.pending, (state) => {
                state.personalMutationStatus = "loading";
                state.personalMutationType = "add";
            })
            .addCase(addPersonalExpense.fulfilled, (state, action) => {
                state.apiResponse = action.payload;
                state.personalMutationStatus = "succeeded";
            })
            .addCase(addPersonalExpense.rejected, (state, action) => {
                state.personalMutationError = action.payload;
                state.personalMutationStatus = "failed";
            })

            .addCase(deletePersonalExpense.pending, (state) => {
                state.personalMutationStatus = "loading";
                state.personalMutationType = "delete";
            })
            .addCase(deletePersonalExpense.fulfilled, (state, action) => {
                state.apiResponse = action.payload;
                state.personalMutationStatus = "succeeded";
            })
            .addCase(deletePersonalExpense.rejected, (state, action) => {
                state.personalMutationError = action.payload;
                state.personalMutationStatus = "failed";
            })

            .addCase(updatePersonalExpense.pending, (state) => {
                state.personalMutationStatus = "loading";
                state.personalMutationType = "update";
            })
            .addCase(updatePersonalExpense.fulfilled, (state, action) => {
                state.apiResponse = action.payload;
                state.personalMutationStatus = "succeeded";
            })
            .addCase(updatePersonalExpense.rejected, (state, action) => {
                state.personalMutationError = action.payload;
                state.personalMutationStatus = "failed";
            })

            .addCase(fetchAllPersonalExpenses.pending, (state) => {
                state.personalMutationStatus = "loading";
                state.personalMutationType = "Fetching expenses";
            })
            .addCase(fetchAllPersonalExpenses.fulfilled, (state, action) => {
                state.apiResponse = action.payload;
                state.personalMutationStatus = "succeeded";
            })
            .addCase(fetchAllPersonalExpenses.rejected, (state, action) => {
                state.personalMutationError = action.payload;
                state.personalMutationStatus = "failed";
            })

            .addCase(fetchExpensesByMonthYear.pending, (state) => {
                state.personalMutationStatus = "loading";
                state.personalMutationType = "Fetching monthly expenses";
            })
            .addCase(fetchExpensesByMonthYear.fulfilled, (state, action) => {
                state.monthlyExpenses = action.payload.expenses;
                state.monthlyTotal = action.payload.total;
                state.personalMutationStatus = "succeeded";
            })
            .addCase(fetchExpensesByMonthYear.rejected, (state, action) => {
                state.personalMutationError = action.payload;
                state.personalMutationStatus = "failed";
            })

    }
})
export const { resetPersonalExpenseMutationState } = personalExpenseSlice.actions;
export default personalExpenseSlice.reducer;