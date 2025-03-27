async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    const resultDiv = document.getElementById('weatherResult');
    const processingDiv = document.getElementById('processing');
    const apiKey = '5d066958a60d315387d9492393935c19';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;

    processingDiv.classList.remove('hidden');
    resultDiv.innerHTML = '';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Місто не знайдено');
            }
            throw new Error('Запит не вдався: ' + response.statusText);
        }
        const data = await response.json();

        const { main, weather, wind } = data;
        resultDiv.innerHTML = `
            <h2>Погода в ${city}</h2>
            <p>Температура: ${main.temp}°C</p>
            <p>Тиск: ${main.pressure} hPa</p>
            <p>Опис: ${weather[0].description}</p>
            <p>Вологість: ${main.humidity}%</p>
            <p>Швидкість вітру: ${wind.speed} м/с</p>
            <p>Напрям вітру: ${wind.deg}°</p>
            <img src="http://openweathermap.org/img/w/${weather[0].icon}.png" alt="Weather icon">
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p>${error.message}</p>`;
        console.log(error);
    } finally {
        processingDiv.classList.add('hidden');
    }
}

async function getPost() {
    const postId = document.getElementById('postIdInput').value;
    const resultDiv = document.getElementById('postResult');
    const processingDiv = document.getElementById('processing');
    if (!postId || postId < 1 || postId > 100) {
        resultDiv.innerHTML = '<p>Введіть ID від 1 до 100</p>';
        return;
    }

    processingDiv.classList.remove('hidden');
    resultDiv.innerHTML = '';

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Пост не знайдено: ' + response.statusText);
        }
        const post = await response.json();

        resultDiv.innerHTML = `
            <h2>Пост #${post.id}</h2>
            <p><strong>Заголовок:</strong> ${post.title}</p>
            <p><strong>Текст:</strong> ${post.body}</p>
            <button onclick="getComments(${post.id})">Показати коментарі</button>
            <div id="comments"></div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<p>${error.message}</p>`;
        console.log(error);
    } finally {
        processingDiv.classList.add('hidden');
    }
}

async function getComments(postId) {
    const commentsDiv = document.getElementById('comments');
    const processingDiv = document.getElementById('processing');

    processingDiv.classList.remove('hidden');
    commentsDiv.innerHTML = ''; 

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        if (!response.ok) {
            throw new Error('Коментарі не знайдено: ' + response.statusText);
        }
        const comments = await response.json();

        commentsDiv.innerHTML = '<h3>Коментарі:</h3>';
        comments.forEach(comment => {
            commentsDiv.innerHTML += `
                <p><strong>${comment.name} (${comment.email}):</strong> ${comment.body}</p>
            `;
        });
    } catch (error) {
        commentsDiv.innerHTML = `<p>${error.message}</p>`;
        console.log(error);
    } finally {
        processingDiv.classList.add('hidden');
    }}