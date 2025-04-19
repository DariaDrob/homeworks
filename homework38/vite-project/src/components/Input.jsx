function Input({ placeholder, onChange }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            onChange={onChange}
            style={{ padding: '10px', margin: '10px', width: '200px' }}
        />
    );
}

export default Input;