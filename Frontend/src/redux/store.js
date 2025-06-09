import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './user/userSlice';
import modalReducer from './modal/modalSlice'
const store = configureStore({
    reducer:{
        auth:authReducer,
        user:userReducer,
        modal:modalReducer,
    }
})

export default store;