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
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 день
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
    if (req.isAuthenticated()) {
        return next();
    }
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
        const users = await db.collection('users').find({}, { projection: { email: 1, _id: 0 } }).toArray();
        res.render('users', { theme, users, user: req.user });
    } catch (err) {
        console.error('Помилка при отриманні користувачів:', err);
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