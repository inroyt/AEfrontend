import {configureStore} from '@reduxjs/toolkit';
import postReducer from './post/postSlice';
import userReducer from './user/userSlice';

import messageReducer from './user/messageSlice'


export const store=configureStore({
    reducer: {
        post:postReducer,
        user:userReducer,
        messages:messageReducer,

    }
})
