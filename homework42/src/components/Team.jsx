import { Outlet } from 'react-router-dom';

function Team() {
    return (
        <div>
            <h3>Наша команда</h3>
            <p>Сторінка про нашу команду.</p>
            <Outlet />
        </div>
    );
}

export default Team;