import { NavLink } from 'react-router-dom';
import './Navigation.scss';

function Navigation() {
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
                    <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
                        Контакти
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;