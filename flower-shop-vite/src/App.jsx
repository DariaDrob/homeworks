import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import About from './components/About';
import ProductDetail from './components/ProductDetail';
import { CartProvider } from './context/CartContext';

function App() {
    const [cartItemCount, setCartItemCount] = useState(0);

    return (
        <CartProvider>
            <BrowserRouter>
                <div className="navbar">
                    <a href="/about">Про нас</a>
                    <a href="/products">Товари</a>
                    <a href="/cart">Кошик ({cartItemCount})</a>
                </div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products setCartItemCount={setCartItemCount} />} />
                    <Route path="/cart" element={<Cart setCartItemCount={setCartItemCount} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/product/:id" element={<ProductDetail setCartItemCount={setCartItemCount} />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;