import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import TaskItem from './TaskItem';
import { setTasks, deleteTask, setLoading, setError } from '../redux/actions/taskActions';
import './AsyncTaskList.scss';

function AsyncTaskList() {
    const tasks = useSelector((state) => state.tasks);
    const loading = useSelector((state) => state.loading);
    const error = useSelector((state) => state.error);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchTasks = async () => {
            dispatch(setLoading(true)); // Устанавливаем loading в true
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
                const formattedTasks = response.data.map(task => ({ task: task.title, isImportant: task.completed }));
                dispatch(setTasks(formattedTasks)); // Устанавливаем задачи и сбрасываем loading/error
            } catch (err) {
                dispatch(setError('Не вдалося завантажити завдання')); // Устанавливаем ошибку
                console.error('Не вдалося завантажити завдання', err);
            }
        };

        fetchTasks();
    }, [dispatch]);

    const handleDelete = (index) => {
        dispatch(deleteTask(index));
    };

    return (
        <div className="async-task-list">
            <h2>Задачи с сервера</h2>
            {loading && <p className="loading">Загрузка данных...</p>}
            {error && <p className="error">Ошибка: {error}</p>}
            {!loading && !error && (
                <ul>
                    {tasks.map((task, index) => (
                        <TaskItem
                            key={index}
                            task={task.task}
                            isImportant={task.isImportant}
                            onDelete={() => handleDelete(index)}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AsyncTaskList;