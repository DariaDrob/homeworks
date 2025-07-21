const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;


const uri = "mongodb+srv://daradrobotenko:hlCYSXNlWOlTvvD6@cluster0.39p1x3j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
let db;


async function connectToMongo() {
    try {
        await client.connect();
        console.log('Підключено до MongoDB Atlas');
        db = client.db('myDatabase');
    } catch (err) {
        console.error('Помилка підключення до MongoDB:', err);
        process.exit(1);
    }
}
connectToMongo();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views/pug'));


passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await db.collection('users').findOne({ email });
            if (!user || !await bcrypt.compare(password, user.password)) {
                return done(null, false, { message: 'Неправильний email або пароль' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
};


app.get('/', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('index', { theme, user: req.user });
});

app.get('/ejs', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render(path.join(__dirname, 'views/ejs/index.ejs'), { theme, user: req.user });
});

app.get('/login', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('login', { theme });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/protected',
    failureRedirect: '/login'
}));

app.get('/register', (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('register', { theme });
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('register', { theme: req.cookies.theme || 'light', error: 'Заповніть усі поля' });
    }
    try {
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).render('register', { theme: req.cookies.theme || 'light', error: 'Користувач уже існує' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { email, password: hashedPassword };
        await db.collection('users').insertOne(user);
        res.redirect('/login');
    } catch (err) {
        console.error('Помилка при реєстрації:', err);
        res.status(500).send('Помилка сервера');
    }
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

app.get('/protected', isAuthenticated, (req, res) => {
    const theme = req.cookies.theme || 'light';
    res.render('protected', { user: req.user, theme });
});

app.post('/set-theme', (req, res) => {
    const { theme } = req.body;
    if (theme !== 'light' && theme !== 'dark') {
        return res.status(400).json({ error: 'Недійсна тема' });
    }
    res.cookie('theme', theme, { maxAge: 900000, httpOnly: true });
    res.redirect('back');
});

app.get('/users', isAuthenticated, async (req, res) => {
    try {
        const theme = req.cookies.theme || 'light';
        const users = [];
        const cursor = db.collection('users').find({}, { projection: { email: 1, _id: 0 } });
        await cursor.forEach(user => users.push(user), (err) => {
            if (err) throw err;
            res.render('users', { theme, users, user: req.user });
        });
    } catch (err) {
        console.error('Помилка при отриманні користувачів:', err);
        res.status(500).send('Помилка сервера');
    }
});

app.post('/users/insertOne', isAuthenticated, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Заповніть усі поля' });
    }
    try {
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Користувач уже існує' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { email, password: hashedPassword };
        const result = await db.collection('users').insertOne(user);
        res.json({ message: 'Користувач доданий', insertedId: result.insertedId });
    } catch (err) {
        console.error('Помилка при вставці:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/users/insertMany', isAuthenticated, async (req, res) => {
    const users = req.body;
    if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ error: 'Надішліть масив користувачів' });
    }
    try {
        const hashedUsers = await Promise.all(users.map(async user => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { email: user.email, password: hashedPassword };
        }));
        const result = await db.collection('users').insertMany(hashedUsers);
        res.json({ message: 'Користувачі додані', insertedIds: result.insertedIds });
    } catch (err) {
        console.error('Помилка при вставці кількох:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/users/updateOne', isAuthenticated, async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Заповніть усі поля' });
    }
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await db.collection('users').updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Користувач не знайдений' });
        }
        res.json({ message: 'Пароль оновлено' });
    } catch (err) {
        console.error('Помилка при оновленні:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/users/updateMany', isAuthenticated, async (req, res) => {
    const { query, newPassword } = req.body;
    if (!query || !newPassword) {
        return res.status(400).json({ error: 'Заповніть усі поля' });
    }
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await db.collection('users').updateMany(
            query,
            { $set: { password: hashedPassword } }
        );
        res.json({ message: `Оновлено ${result.modifiedCount} користувачів` });
    } catch (err) {
        console.error('Помилка при оновленні кількох:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/users/replaceOne', isAuthenticated, async (req, res) => {
    const { email, newUser } = req.body;
    if (!email || !newUser) {
        return res.status(400).json({ error: 'Заповніть усі поля' });
    }
    try {
        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const replacement = { ...newUser, password: hashedPassword };
        const result = await db.collection('users').replaceOne(
            { email },
            replacement
        );
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Користувач не знайдений' });
        }
        res.json({ message: 'Користувач замінено' });
    } catch (err) {
        console.error('Помилка при заміні:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/users/deleteOne', isAuthenticated, async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Вкажіть email' });
    }
    try {
        const result = await db.collection('users').deleteOne({ email });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Користувач не знайдений' });
        }
        res.json({ message: 'Користувач видалено' });
    } catch (err) {
        console.error('Помилка при видаленні:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/users/deleteMany', isAuthenticated, async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Вкажіть критерій' });
    }
    try {
        const result = await db.collection('users').deleteMany(query);
        res.json({ message: `Видалено ${result.deletedCount} користувачів` });
    } catch (err) {
        console.error('Помилка при видаленні кількох:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});


app.get('/stats', isAuthenticated, async (req, res) => {
    try {
        const theme = req.cookies.theme || 'light';
        const result = await db.collection('users').aggregate([
            { $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    avgPasswordLength: { $avg: { $strLenCP: '$password' } }
                } }
        ]).toArray();
        const stats = result[0] || { totalUsers: 0, avgPasswordLength: 0 };
        res.render('stats', { theme, stats, user: req.user });
    } catch (err) {
        console.error('Помилка при отриманні статистики:', err);
        res.status(500).send('Помилка сервера');
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Щось пішло не так!');
});

app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});