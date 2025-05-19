import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';

const store = configureStore({
    reducer: taskReducer, // Плоская структура
});

export default store;