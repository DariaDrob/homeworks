import { useContext, useEffect } from 'react';
import CartContext from '../context/CartContext';

const Cart = ({ setCartItemCount }) => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    useEffect(() => {
        setCartItemCount(cart.length);
        console.log('Cart in Cart component:', cart);
    }, [cart, setCartItemCount]);

    return (
        <div className="blurred-background">
            <div className="content-wrapper">
                <div className="container">
                    <h1>Кошик</h1>
                    {cart.length === 0 ? (
                        <p>Кошик порожній</p>
                    ) : (
                        <div>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
                                    <div>
                                        <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>{item.name} x {item.quantity}</h2>
                                        <p style={{ color: '#666' }}>
                                            Ціна за 1 букет: {item.price} грн<br />
                                            Ціна за {item.quantity} букетів: {item.totalPrice} грн
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1, item.price)}
                                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                                        />
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ color: '#ef4444', textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: '24px', fontSize: '20px', fontWeight: '500', color: '#333', textAlign: 'center' }}>
                                Загальна сума замовлення: {total} грн
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;