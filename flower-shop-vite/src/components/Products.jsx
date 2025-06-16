import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import flowerService from '../services/flowerService';

const Products = ({ setCartItemCount }) => {
    const [flowers, setFlowers] = useState([]);
    const [category, setCategory] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        flowerService.getFlowers()
            .then(data => {
                setFlowers(data);
                console.log('Flowers loaded:', data);
            })
            .catch(error => {
                console.error('Error loading flowers:', error);
            });
    }, []);

    const categories = [...new Set(flowers.map(flower => flower.category))];
    const filteredFlowers = flowers.filter(flower => {
        return (
            (category ? flower.category === category : true) &&
            (priceRange ? (
                priceRange === 'low' ? flower.price <= 2000 :
                    priceRange === 'mid' ? flower.price > 2000 && flower.price <= 2500 :
                        flower.price > 2500
            ) : true) &&
            (search ? flower.name.toLowerCase().includes(search.toLowerCase()) : true)
        );
    });

    const renderStars = (rating) => {
        const stars = Math.round(rating);
        return (
            <div style={{ display: 'inline-flex', alignItems: 'center', color: '#FFD700' }}>
                {[...Array(stars)].map((_, i) => (
                    <svg key={i} style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.431 8.167 1.191-5.917 5.765 1.396 8.134-7.314-3.85-7.314 3.85 1.396-8.134-5.917-5.765 8.167-1.191z"/>
                    </svg>
                ))}
                <span style={{ marginLeft: '4px', color: '#333' }}>({rating})</span>
            </div>
        );
    };

    return (
        <div className="blurred-background">
            <div className="content-wrapper">
                <div className="container">
                    <h1>Товари</h1>
                    {flowers.length === 0 ? (
                        <p>Завантаження...</p>
                    ) : (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                    <option value="">Усі категорії</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                    <option value="">Усі ціни</option>
                                    <option value="low">До 2000 грн</option>
                                    <option value="mid">2000-2500 грн</option>
                                    <option value="high">Понад 2500 грн</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Пошук за назвою"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#d4d4d4 #f5f5f5' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', width: '100%' }}>
                                    {filteredFlowers.map(flower => (
                                        <Link
                                            to={`/product/${flower.id}`}
                                            key={flower.id}
                                            style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                display: 'block',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    padding: '16px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                    transition: 'transform 0.2s',
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                            >
                                                <img src={flower.image} alt={flower.name} style={{ width: '100%', height: '192px', objectFit: 'cover', borderRadius: '4px', marginBottom: '16px' }} />
                                                <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>{flower.name}</h2>
                                                <p style={{ color: '#666', marginBottom: '8px' }}>Від {flower.price} грн</p>
                                                {renderStars(flower.rating)}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;