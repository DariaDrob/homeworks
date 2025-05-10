function TodoItem({ todo, onDelete }) {
    return (
        <li>
            {todo}
            <button onClick={onDelete} style={{ marginLeft: '10px' }}>
                Видалити
            </button>
        </li>
    );
}

export default TodoItem;