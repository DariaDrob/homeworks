import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import flowerService from '../services/flowerService';
import CartContext from '../context/CartContext';

const ProductDetail = ({ setCartItemCount }) => {
    const { id } = useParams();
    const [flower, setFlower] = useState(null);
    const { cart, addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        flowerService.getFlowers()
            .then(flowers => {
                const found = flowers.find(f => f.id === parseInt(id));
                if (found) {
                    setFlower(found);
                    console.log(`Found flower: ${found.name}, id: ${found.id}`);
                } else {
                    console.error(`Flower with id ${id} not found`);
                }
            })
            .catch(error => console.error('Error fetching flowers:', error));
    }, [id]);

    useEffect(() => {
        setCartItemCount(cart.length);
        console.log('Cart updated:', cart);
    }, [cart, setCartItemCount]);

    if (!flower) return <div className="blurred-background"><div className="content-wrapper"><div className="container">Завантаження...</div></div></div>;

    const getFlowerDetails = (id) => {
        switch (id) {
            case 1: // Троянди червоні
                return {
                    description: "Червоні троянди — класичний символ глибокої любові та пристрасті. Кожна квітка на високому стеблі заввишки 50 см вражає своєю насиченістю кольору та елегантністю. Ці троянди вирощуються з особливою турботою в екологічно чистих умовах.",
                    forWhom: "Цей букет створений для коханої людини, дружини чи подруги, яка мріє про романтику.",
                    situations: "Ідеально для першого побачення, ювілею кохання чи пропозиції руки і серця.",
                };
            case 2: // Тюльпани білі
                return {
                    description: "Білі тюльпани — втілення ніжності, чистоти та витонченості. Кожна квітка має стебло заввишки 40 см і вирізняється своєю природною свіжістю. Вони додають легкості та гармонії будь-якому простору.",
                    forWhom: "Чудовий подарунок для мами, сестри чи колеги, які цінують спокій і красу.",
                    situations: "Підходить для дня народження, вибачень чи святкування весни, наприклад, 8 Березня.",
                };
            case 3: // Соняшники
                return {
                    description: "Яскраві соняшники — символ сонця, радості та оптимізму. Кожна квітка на стеблі заввишки 60 см випромінює енергію та тепло. Ці квіти ідеально підходять для створення позитивного настрою.",
                    forWhom: "Соняшники створені для друзів, дітей чи колег, які люблять яскраві емоції.",
                    situations: "Чудово для дружніх посиденьок, привітання з успіхом чи літнього свята.",
                };
            case 4: // Лілії рожеві
                return {
                    description: "Ніжні рожеві лілії — символ витонченості та ніжності. Їх стебла заввишки 50 см додають простору елегантності та вишуканості з легким ароматом.",
                    forWhom: "Для подруги, сестри чи мами, які люблять ніжні та витончені квіти.",
                    situations: "Підходить для романтичних вечорів, ювілеїв чи подарунка на знак подяки.",
                };
            case 5: // Піони білі
                return {
                    description: "Білі піони — символ чистоти та достатку. Їх стебла заввишки 45 см і пишні пелюстки створюють розкішний букет із ніжним ароматом.",
                    forWhom: "Ідеально для бабусі, коханої чи подруги, яка цінує витонченість.",
                    situations: "Чудово для весілля, випускного чи як подарунок на особливу дату.",
                };
            case 6: // Хризантеми жовті
                return {
                    description: "Жовті хризантеми — символ радості та довголіття. Їх стебла заввишки 40 см додають яскравості будь-якому інтер’єру.",
                    forWhom: "Для друзів, колег чи родичів, які люблять сонячні кольори.",
                    situations: "Підходить для осінніх свят, привітань чи створення затишку.",
                };
            case 7: // Еустоми фіолетові
                return {
                    description: "Фіолетові еустоми — ніжні квіти з м’якими пелюстками, що нагадують маленькі троянди. Стебла заввишки 45 см додають романтики.",
                    forWhom: "Для романтичних натур: коханої, подруги чи сестри.",
                    situations: "Ідеально для побачень, заручин чи подарунка на знак вдячності.",
                };
            case 8: // Ромашки польові
                return {
                    description: "Польові ромашки — символ простоти та природної краси. Їх стебла заввишки 35 см додають затишку та легкості.",
                    forWhom: "Для дітей, друзів чи близьких, які цінують природність.",
                    situations: "Чудово для дружніх зустрічей, пікніків чи подарунка з нагоди.",
                };
            case 9: // Гортензії блакитні
                return {
                    description: "Блакитні гортензії — розкішні квіти з великими суцвіттями. Їх стебла заввишки 50 см створюють ефектний букет.",
                    forWhom: "Для тих, хто любить вишуканість: мами, подруги чи колеги.",
                    situations: "Підходить для весіль, ювілеїв чи офіційних подій.",
                };
            case 10: // Троянди білі
                return {
                    description: "Білі троянди — символ чистоти та ніжності. Їх стебла заввишки 50 см ідеально підходять для вишуканих букетів.",
                    forWhom: "Для коханої, мами чи подруги, яка цінує елегантність.",
                    situations: "Ідеально для весіль, хрещин чи подарунка на знак поваги.",
                };
            case 11: // Тюльпани рожеві
                return {
                    description: "Рожеві тюльпани — втілення м’якості та радості. Їх стебла заввишки 40 см додають ніжності будь-якому простору.",
                    forWhom: "Для сестри, подруги чи колеги, яка любить ніжні кольори.",
                    situations: "Підходить для дня народження, свят чи як жест турботи.",
                };
            case 12: // Лілії білі
                return {
                    description: "Білі лілії — символ чистоти та вишуканості. Їх стебла заввишки 50 см наповнюють простір ніжним ароматом.",
                    forWhom: "Для мами, бабусі чи подруги, яка цінує класику.",
                    situations: "Чудово для офіційних подій, весіль чи подарунка на свято.",
                };
            case 13: // Піони рожеві
                return {
                    description: "Рожеві піони — символ ніжності та достатку. Їх стебла заввишки 45 см створюють розкішний і ароматний букет.",
                    forWhom: "Для коханої, подруги чи мами, яка любить розкіш.",
                    situations: "Ідеально для весілля, ювілею чи подарунка на особливу подію.",
                };
            case 14: // Еустоми білі
                return {
                    description: "Білі еустоми — ніжні квіти з м’якими пелюстками. Їх стебла заввишки 45 см додають легкості та романтики.",
                    forWhom: "Для сестри, подруги чи колеги, яка цінує витонченість.",
                    situations: "Підходить для побачень, вибачень чи подарунка на знак вдячності.",
                };
            case 15: // Гортензії рожеві
                return {
                    description: "Рожеві гортензії — символ ніжності та гармонії. Їх стебла заввишки 50 см створюють пишний і ефектний букет.",
                    forWhom: "Для мами, коханої чи подруги, яка любить м’які відтінки.",
                    situations: "Чудово для весіль, ювілеїв чи подарунка на свято.",
                };
            default:
                return {
                    description: "Ці квіти — унікальний вибір для особливого моменту.",
                    forWhom: "Для тих, хто шукає щось особливе.",
                    situations: "Для будь-якої нагоди, коли хочеться здивувати.",
                };
        }
    };

    const details = getFlowerDetails(flower.id);
    const totalPrice = flower.price * quantity;

    return (
        <div className="blurred-background">
            <div className="content-wrapper">
                <div className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <img src={flower.image} alt={flower.name} style={{ width: '100%', height: 'auto', maxHeight: '600px', objectFit: 'contain', borderRadius: '8px' }} />
                        <div>
                            <h1 style={{ fontSize: '30px', fontWeight: 'normal', color: '#333', marginBottom: '16px' }}>{flower.name}</h1>
                            <p style={{ color: '#666', marginBottom: '16px' }}>{details.description}</p>
                            <p style={{ color: '#666', marginBottom: '16px' }}>Для кого: {details.forWhom}</p>
                            <p style={{ color: '#666', marginBottom: '16px' }}>Підходить для: {details.situations}</p>
                            <p style={{ fontSize: '20px', fontWeight: '500', color: '#333', marginBottom: '16px' }}>Ціна за букет: {flower.price} грн</p>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ marginRight: '16px' }}>Кількість букетів:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                                />
                            </div>
                            <p style={{ fontSize: '20px', fontWeight: '500', color: '#333', marginBottom: '16px' }}>Загальна сума: {totalPrice} грн</p>
                            <button
                                onClick={() => {
                                    addToCart({ ...flower, quantity, totalPrice });
                                    console.log('Added to cart:', { ...flower, quantity, totalPrice });
                                }}
                                style={{ backgroundColor: '#4B5563', color: 'white', padding: '8px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                            >
                                Додати до кошика
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;