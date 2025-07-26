const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;


mongoose.connect('mongodb://localhost:27017/flower_shop_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    category: String,
    price: Number,
    image: String,
    description: String,
    rating: Number,
});
const Product = mongoose.model('Product', productSchema);


app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});