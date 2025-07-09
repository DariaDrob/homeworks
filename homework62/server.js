const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3000;
const secretKey = 'mysecretkey'; // Секретний ключ для JWT


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views/pug'));


const users = [
    { id: 1, username: 'user1', password: 'password123' }
];


const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Токен відсутній' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недійсний токен' });
        }
        req.user = user;
        next();
    });
};


app.get('/', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('index', { theme });
});


app.get('/ejs', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render(path.join(__dirname, 'views/ejs/index.ejs'), { theme });
});


app.post('/set-theme', (req, res) => {
    const { theme } = req.body;
    if (theme !== 'light' && theme !== 'dark') {
        return res.status(400).json({ error: 'Недійсна тема' });
    }
    res.cookie('theme', theme, { maxAge: 900000, httpOnly: true });
    res.redirect('back'); // Повертаємося на попередню сторінку
});


app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Потрібні ім’я користувача та пароль' });
    }
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Користувач уже існує' });
    }
    const user = { id: users.length + 1, username, password };
    users.push(user);
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.json({ message: 'Реєстрація успішна', token });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Неправильне ім’я користувача або пароль' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.json({ message: 'Вхід успішний', token });
});


app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: `Привіт, ${req.user.username}! Це захищений маршрут.` });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутрішня помилка сервера' });
});

app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});