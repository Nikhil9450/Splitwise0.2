import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './user/userSlice';
import modalReducer from './modal/modalSlice';
import friendListReducer from './friendList/friendlistSlice';
const store = configureStore({
    reducer:{
        auth:authReducer,
        user:userReducer,
        modal:modalReducer,
        friendList:friendListReducer,
    }
})

export default store;