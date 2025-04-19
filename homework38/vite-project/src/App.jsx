import { useState } from 'react';
import Button from './components/Button';
import Input from './components/Input';
import './App.css';

function App() {
    const [text, setText] = useState('');

    const handleButtonClick = () => {
        alert('You entered: ' + text);
    };

    const handleInputChange = (event) => {
        setText(event.target.value);
    };

    return (
        <div className="App">
            <h1>My First React App</h1>
            <Input
                placeholder="Type something..."
                onChange={handleInputChange}
            />
            <Button
                text="Show Text"
                onClick={handleButtonClick}
            />
        </div>
    );
}

export default App;