const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = 3000;


const users = [
    { id: 1, email: 'user1@example.com', password: 'password123' }
];


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
    { usernameField: 'email' }, // Використовуємо email замість username
    (email, password, done) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return done(null, false, { message: 'Неправильний email або пароль' });
        }
        return done(null, user);
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
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

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).render('register', { theme: req.cookies.theme || 'light', error: 'Заповніть усі поля' });
    }
    if (users.find(u => u.email === email)) {
        return res.status(400).render('register', { theme: req.cookies.theme || 'light', error: 'Користувач уже існує' });
    }
    const user = { id: users.length + 1, email, password };
    users.push(user);
    res.redirect('/login');
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


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Щось пішло не так!');
});

app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});