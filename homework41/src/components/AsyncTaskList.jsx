import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskItem from './TaskItem';
import { fetchTasks, deleteTask } from '../redux/taskSlice';
import './AsyncTaskList.scss';

function AsyncTaskList() {
    const tasks = useSelector((state) => state.tasks);
    const loading = useSelector((state) => state.loading);
    const error = useSelector((state) => state.error);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleDelete = (index) => {
        dispatch(deleteTask(index));
    };

    return (
        <div className="async-task-list">
            <h2>Задачи с сервера</h2>
            {loading && <p className="loading">Загрузка данных...</p>}
            {error && <p className="error">Ошибка: {error}</p>}
            {!loading && !error && tasks.length > 0 && (
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
            {!loading && !error && tasks.length === 0 && (
                <p>Нет задач для отображения.</p>
            )}
        </div>
    );
}

export default AsyncTaskList;