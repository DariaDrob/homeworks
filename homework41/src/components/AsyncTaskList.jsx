import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';
import './AsyncTaskList.scss';

function AsyncTaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
                setTasks(response.data.map(task => ({ task: task.title, isImportant: task.completed })));
                setLoading(false);
            } catch (err) {
                setError('Не вдалося завантажити завдання');
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleDelete = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div className="async-task-list">
            <h2>Завдання з сервера</h2>
            {loading && <p className="loading">Завантаження даних...</p>}
            {error && <p className="error">Помилка: {error}</p>}
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