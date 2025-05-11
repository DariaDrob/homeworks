export const SET_TASKS = 'SET_TASKS';
export const DELETE_TASK = 'DELETE_TASK';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';


export const setTasks = (tasks) => ({
    type: SET_TASKS,
    payload: tasks,
});

export const deleteTask = (index) => ({
    type: DELETE_TASK,
    payload: index,
});

export const setLoading = (loading) => ({
    type: SET_LOADING,
    payload: loading,
});

export const setError = (error) => ({
    type: SET_ERROR,
    payload: error,
});