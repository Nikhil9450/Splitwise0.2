import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addExpense = createAsyncThunk("expense/addExpense",async(data,thunkAPI)=>{
    console.log('data inside the addExpense thunk---------->',data);
    console.log('groupid inside the addExpense thunk---------->',data.group);
    try {
        const response=  await axios.post("http://localhost:5000/expense/addExpense",{data},{withCredentials:true})
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
        const response=  await axios.post("http://localhost:5000/expense/updateExpense",{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchGroupExpenses(data.group));
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
        const response=  await axios.post("http://localhost:5000/expense/deleteExpense",{data},{withCredentials:true})
        console.log("response---------->",response.data) 
        await thunkAPI.dispatch(fetchGroupExpenses(data.group));
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
        const response = await axios.get('http://localhost:5000/expense/fetchGroupExpenses',{
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

const expenseSlice = createSlice({
    name:'expense',
    initialState:{
        expense:[],
        addResponse:"",
        status: 'idle',
        error: null,

        fetchExpenseStatus: 'idle',
        fetchExpenseError: null,

        updateExpenseStatus: 'idle',
        updateExpenseError: null,

        deleteExpenseStatus: 'idle',
        deleteExpenseError: null,
    },
    extraReducers: (builder)=>{
        builder 
            .addCase(addExpense.pending,(state)=>{
                state.status="loading"
            })
            .addCase(addExpense.fulfilled,(state,action)=>{
                state.addResponse=action.payload;
                state.status='succeeded';
            })
            .addCase(addExpense.rejected,(state,action)=>{
                state.error= action.payload || "Fetching list failed";
                state.status='failed';
            })

            .addCase(deleteExpense.pending,(state)=>{
                state.deleteExpenseStatus="loading"
            })
            .addCase(deleteExpense.fulfilled,(state,action)=>{
                state.addResponse=action.payload;
                state.deleteExpenseStatus='succeeded';
            })
            .addCase(deleteExpense.rejected,(state,action)=>{
                state.deleteExpenseError= action.payload || "Deletion failed";
                state.deleteExpenseStatus='failed';
            })

            .addCase(updateExpense.pending,(state)=>{
                state.updateExpenseStatus="loading"
            })
            .addCase(updateExpense.fulfilled,(state,action)=>{
                state.addResponse=action.payload;
                state.updateExpenseStatus='succeeded';
            })
            .addCase(updateExpense.rejected,(state,action)=>{
                state.updateExpenseError= action.payload || "Updating failed";
                state.updateExpenseStatus='failed';
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
    }
})

export default expenseSlice.reducer;