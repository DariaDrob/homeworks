import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Navigation.scss';

function Navigation() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <nav className="navigation">
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Головна
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Про нас
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about/team" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Команда
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about/team/leader" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Лідер
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Контакти
                    </NavLink>
                </li>
                <li>
                    <button onClick={toggleTheme}>
                        Тема: {theme === 'light' ? 'Світла' : 'Темна'}
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;