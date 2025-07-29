const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flower_shop_db';


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB with Mongoose');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('MongoDB connection error:', err));


const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'ID is required'],
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Троянди', 'Тюльпани', 'Соняшники', 'Лілії', 'Півонії', 'Хризантеми', 'Еустоми', 'Ромашки', 'Гортензії', 'Інші'],
            message: 'Category must be one of: Троянди, Тюльпани, Соняшники, Лілії, Півонії, Хризантеми, Еустоми, Ромашки, Гортензії, Інші',
        },
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    image: {
        type: String,
        default: '/images/default.jpg',
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    rating: {
        type: Number,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5'],
        default: 0,
    },
    stock: {
        type: Number,
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
}, {
    timestamps: true,
});
productSchema.index({ category: 1, price: 1 }); // Індексація для фільтрації

const Product = mongoose.model('Product', productSchema);


const orderSchema = new mongoose.Schema({
    products: [{
        productId: { type: Number, required: [true, 'Product ID is required'] },
        name: { type: String, required: [true, 'Product name is required'] },
        price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
        quantity: { type: Number, required: [true, 'Quantity is required'], min: [1, 'Quantity must be at least 1'] },
    }],
    userData: {
        name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: [50, 'Name cannot exceed 50 characters'] },
        phone: { type: String, required: [true, 'Phone number is required'], match: [/^\+?\d{10,12}$/, 'Invalid phone number format'] },
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    total: { type: Number, required: [true, 'Total is required'], min: [0, 'Total cannot be negative'] },
}, {
    timestamps: true,
});
orderSchema.index({ 'userData.phone': 1 }); // Індексація для пошуку за номером телефону

const Order = mongoose.model('Order', orderSchema);


mongoose.connection.once('open', async () => {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
        await Product.insertMany([
            { id: 1, name: 'Троянди червоні', category: 'Троянди', price: 2500, image: '/images/red-roses.jpg', description: 'Класичні троянди', rating: 4.8, stock: 10 },
            { id: 2, name: 'Тюльпани білі', category: 'Тюльпани', price: 1500, image: '/images/white-tulips.jpg', description: 'Ніжні тюльпани', rating: 4.5, stock: 15 },
        ]);
        console.log('Initial products added');
    }
});


app.get('/api/products', async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let query = {};
        if (category) query.category = category;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }
        const products = await Product.find(query).sort({ category: 1, price: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error adding product', error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndUpdate(
            { id: parseInt(id) },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ id: parseInt(id) });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});


app.post('/api/orders', async (req, res) => {
    try {
        const { products, userData } = req.body;
        const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const order = new Order({ products, userData, total });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
    } catch (error) {
        res.status(400).json({ message: 'Error placing order', error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order', error: error.message });
    }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByIdAndDelete(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
});