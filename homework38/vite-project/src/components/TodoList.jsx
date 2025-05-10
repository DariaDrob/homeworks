import { useState } from 'react';
import TodoItem from './TodoItem';
import Input from './Input';
import Button from './Button';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [isListVisible, setIsListVisible] = useState(true);

    const addTodo = () => {
        if (newTodo.trim() !== '') {
            setTodos([...todos, newTodo]);
            setNewTodo('');
        }
    };

    const deleteTodo = (index) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    const toggleListVisibility = () => {
        setIsListVisible(!isListVisible);
    };

    return (
        <div>
            <h2>Список Завдань (Функціональний)</h2>
            <Input
                placeholder="Введіть нове завдання..."
                onChange={(e) => setNewTodo(e.target.value)}
                value={newTodo}
            />
            <Button text="Додати" onClick={addTodo} />
            <Button text={isListVisible ? 'Приховати список' : 'Показати список'} onClick={toggleListVisibility} />
            {isListVisible && (
                <ul>
                    {todos.map((todo, index) => (
                        <TodoItem key={index} todo={todo} onDelete={() => deleteTodo(index)} />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TodoList;