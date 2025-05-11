import { useState } from 'react';
import Input from './Input';
import Button from './Button';

function ControlledForm({ onAddTodo }) {
    const [task, setTask] = useState('');
    const [isImportant, setIsImportant] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (task.trim() !== '') {
            onAddTodo({ task, isImportant });
            setTask('');
            setIsImportant(false);
        }
    };

    return (
        <div>
            <h2>Контрольована форма</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    placeholder="Введіть завдання..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isImportant}
                        onChange={(e) => setIsImportant(e.target.checked)}
                    />
                    Важливе
                </label>
                <Button text="Додати завдання" type="submit" />
            </form>
        </div>
    );
}

export default ControlledForm;