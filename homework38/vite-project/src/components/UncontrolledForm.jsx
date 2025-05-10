import { useRef } from 'react';
import Input from './Input';
import Button from './Button';

function UncontrolledForm({ onAddTodo }) {
    const taskRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const task = taskRef.current.value;
        if (task.trim() !== '') {
            onAddTodo({ task, isImportant: false });
            taskRef.current.value = '';
        }
    };

    return (
        <div>
            <h2>Неконтрольована форма</h2>
            <form onSubmit={handleSubmit}>
                <Input placeholder="Введіть завдання..." ref={taskRef} />
                <Button text="Додати завдання" type="submit" />
            </form>
        </div>
    );
}

export default UncontrolledForm;