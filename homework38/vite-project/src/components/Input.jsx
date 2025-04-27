import { forwardRef } from 'react';

const Input = forwardRef(({ placeholder, onChange, value }, ref) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            ref={ref}
            style={{ padding: '10px', margin: '10px', width: '200px' }}
        />
    );
});

export default Input;