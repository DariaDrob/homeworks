function Button({ text, onClick }) {
    return (
        <button onClick={onClick} style={{ padding: '10px 20px', margin: '10px' }}>
            {text}
        </button>
    );
}

export default Button;