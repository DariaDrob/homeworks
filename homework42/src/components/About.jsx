import { Outlet } from 'react-router-dom';
function About() {
    return (
        <div>
            <h2>Сторінка про нас</h2>
            <p>React-додаток для навчання.</p>
            <Outlet />
        </div>
    );
}

export default About;