import { useContext, useEffect } from 'react';
import CartContext from '../context/CartContext';

const Cart = ({ setCartItemCount }) => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    const [userData, setUserData] = useState({ name: '', phone: '' });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setCartItemCount(cart.length);
        console.log('Cart in Cart component:', cart);
    }, [cart, setCartItemCount]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const placeOrder = async () => {
        setIsSubmitting(true);
        const orderData = {
            products: cart.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            userData,
            total,
        };
        const result = await flowerService.placeOrder(orderData);
        setIsSubmitting(false);
        if (result) {
            setMessage('Замовлення успішно відправлено!');
            setCart([]);
            localStorage.removeItem('cart');
        } else {
            setMessage('Помилка при відправленні замовлення.');
        }
    };

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
                            <div style={{ marginTop: '24px' }}>
                                <h2>Ваші дані</h2>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    placeholder="Ім'я"
                                    required
                                    style={{ padding: '8px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleChange}
                                    placeholder="Номер телефону (наприклад, +380123456789)"
                                    required
                                    style={{ padding: '8px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
                                />
                                <button
                                    onClick={placeOrder}
                                    disabled={isSubmitting}
                                    style={{ backgroundColor: '#4B5563', color: 'white', padding: '8px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                >
                                    {isSubmitting ? 'Відправка...' : 'Відправити замовлення'}
                                </button>
                                {message && <p style={{ marginTop: '8px', color: message.includes('успішно') ? 'green' : 'red' }}>{message}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;