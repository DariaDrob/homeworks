import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронный экшен для загрузки задач
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
        return response.data.map(task => ({ task: task.title, isImportant: task.completed }));
    } catch (err) {
        return rejectWithValue('Не вдалося завантажити завдання');
    }
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter((_, index) => index !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { deleteTask } = taskSlice.actions;
export default taskSlice.reducer;