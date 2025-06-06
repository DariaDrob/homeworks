import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="bg-[#F5F5F5] p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex space-x-4">
                <Link to="/products" className="text-gray-700 hover:text-gray-900">Товари</Link>
                <Link to="/products" className="text-gray-700 hover:text-gray-900">Букети</Link>
                <Link to="/products" className="text-gray-700 hover:text-gray-900">Для компанії</Link>
            </div>
            <Link to="/" className="text-2xl font-light text-gray-900">КВІТКОВИЙ МАГАЗИН</Link>
            <div className="flex items-center space-x-4">
                <select className="text-gray-700 bg-transparent border-none">
                    <option value="uk">UK</option>
                    <option value="ru">RU</option>
                </select>
                <Link to="/cart">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                </Link>
            </div>
        </div>
    </nav>
);

export default Navbar;