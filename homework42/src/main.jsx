import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeContext } from './context/ThemeContext';
import App from './App';
import './index.css';

function Root() {
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);