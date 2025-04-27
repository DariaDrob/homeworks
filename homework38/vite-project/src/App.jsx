import { useState } from 'react';
import TodoList from './components/TodoList';
import ClassTodoList from './components/ClassTodoList';
import ControlledForm from './components/ControlledForm';
import UncontrolledForm from './components/UncontrolledForm';
import ServerTaskList from './components/ServerTaskList';
import TaskItem from './components/TaskItem';
import './App.css';

function App() {
    const [formTasks, setFormTasks] = useState([]);

    const addTask = (task) => {
        setFormTasks([...formTasks, task]);
    };

    const deleteTask = (index) => {
        setFormTasks(formTasks.filter((_, i) => i !== index));
    };

    return (
        <div className="App">
            <h1>Мій To-Do List (Контрольовані та Неконтрольовані форми)</h1>
            <div style={{ marginBottom: '40px' }}>
                <ControlledForm onAddTodo={addTask} />
            </div>
            <div style={{ marginBottom: '40px' }}>
                <UncontrolledForm onAddTodo={addTask} />
            </div>
            <div style={{ marginBottom: '40px' }}>
                <h2>Завдання з форм</h2>
                <ul>
                    {formTasks.map((task, index) => (
                        <TaskItem
                            key={index}
                            task={task.task}
                            isImportant={task.isImportant}
                            onDelete={() => deleteTask(index)}
                        />
                    ))}
                </ul>
            </div>
            <div style={{ marginBottom: '40px' }}>
                <ServerTaskList />
            </div>
            <div style={{ marginBottom: '40px' }}>
                <h2>Попередні списки (для порівняння)</h2>
                <TodoList />
            </div>
            <div>
                <ClassTodoList />
            </div>
        </div>
    );
}

export default App;