const express = require('express');
const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(express.static('public'));

const articles = [
    { id: 1, title: 'Прогнозування попиту', content: 'Стаття про лінійну регресію...' },
    { id: 2, title: 'Оптимізація запасів', content: 'Стаття про модель EOQ...' }
];

app.get('/articles', (req, res) => {
    res.render('articles', { articles: articles });
});

app.get('/articles/:articleId', (req, res) => {
    const article = articles.find(a => a.id === parseInt(req.params.articleId));
    if (article) {
        res.render('articleDetail', { article: article });
    } else {
        res.status(404).send('Стаття не знайдена');
    }
});
app.get('/', (req, res) => {
    res.send('Сервер працює!');
});
app.listen(port, () => {
    console.log(`Сервер запущено на http://localhost:${port}`);
});