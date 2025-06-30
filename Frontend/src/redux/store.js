import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './user/userSlice';
import modalReducer from './modal/modalSlice';
import friendListReducer from './friendList/friendlistSlice';
import userGroupListReducer from './userGroups/userGroupsSlice';
import expensesReducer from './expense/expenseSlice';
const store = configureStore({
    reducer:{
        auth:authReducer,
        user:userReducer,
        modal:modalReducer,
        friendList:friendListReducer,
        userGroups:userGroupListReducer,
        expenses:expensesReducer,
    }
})

export default store;