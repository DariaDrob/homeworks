import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import About from './components/About';
import Team from './components/Team';
import TeamLeader from './components/TeamLeader';
import Contact from './components/Contact';
import './App.scss';

function AppRoutes() {
    return useRoutes([
        { path: '/', element: <Home /> },
        {
            path: '/about',
            element: <About />,
            children: [
                { path: 'team', element: <Team />, children: [{ path: 'leader', element: <TeamLeader /> }] },
            ],
        },
        { path: '/contact', element: <Contact /> },
    ]);
}

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="App">
                    <h1>React Додаток</h1>
                    <Navigation />
                    <AppRoutes />
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;