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
    .then(() => console.log('Connected to MongoDB with Mongoose'))
    .catch(err => console.error('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
    id: { type: Number, required: [true, 'ID is required'], unique: true, index: true },
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: [100, 'Name cannot exceed 100 characters'] },
    category: { type: String, required: [true, 'Category is required'], enum: ['Троянди', 'Тюльпани', 'Соняшники', 'Інші'] },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    image: { type: String, default: '/images/default.jpg' },
    description: { type: String, maxlength: [500, 'Description cannot exceed 500 characters'] },
    rating: { type: Number, min: [0, 'Rating cannot be negative'], max: [5, 'Rating cannot exceed 5'], default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ id: parseInt(req.params.id) });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndUpdate({ id: parseInt(id) }, req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ id: parseInt(id) });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
