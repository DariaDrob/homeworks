import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart saved to localStorage:', cart);
    }, [cart]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            const newCart = existing
                ? prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity, totalPrice: i.price * (i.quantity + item.quantity) } : i
                )
                : [...prev, { ...item, totalPrice: item.price * item.quantity }];
            console.log('Cart after add:', newCart);
            return newCart;
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, quantity, price) => {
        setCart(prev =>
            prev.map(item =>
                item.id === item.id ? { ...item, quantity, totalPrice: price * quantity } : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;