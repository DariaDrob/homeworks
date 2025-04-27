import { useState, useEffect } from 'react';
import TaskItem from './TaskItem';

function ServerTaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
                if (!response.ok) {
                    throw new Error('Не вдалося завантажити завдання');
                }
                const data = await response.json();
                setTasks(data.map(task => ({ task: task.title, isImportant: task.completed })));
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleDelete = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h2>Завдання з сервера</h2>
            {loading && <p>Завантаження...</p>}
            {error && <p>Помилка: {error}</p>}
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

export default ServerTaskList;