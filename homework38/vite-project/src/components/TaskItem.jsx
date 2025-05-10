function TaskItem({ task, isImportant, onDelete }) {
    return (
        <li style={{ color: isImportant ? 'red' : 'black' }}>
            {task}
            {isImportant && ' (Важливе)'}
            <button onClick={onDelete} style={{ marginLeft: '10px' }}>
                Видалити
            </button>
        </li>
    );
}

export default TaskItem;