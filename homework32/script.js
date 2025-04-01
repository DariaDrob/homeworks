const API_KEY = 'RtxTNGwYhVzZc8e6vQqXgdU0BAoM5mNEnxtJcMs2';
const BASE_URL = 'https://images-api.nasa.gov/';

const searchTextElement = document.getElementById('searchText');
const spaceContainerElement = document.getElementById('spaceContainer');
const errorContainerElement = document.getElementById('errorContainer');
const loadingContainerElement = document.getElementById('loadingContainer');

searchTextElement.addEventListener('input', debounce(onTextInput, 500));

async function onTextInput() {
    spaceContainerElement.innerHTML = '';
    errorContainerElement.innerHTML = '';
    loadingContainerElement.style.display = 'block';

    const searchString = searchTextElement.value.trim();

    if (!searchString) {
        errorContainerElement.innerHTML = 'Введіть запит';
        loadingContainerElement.style.display = 'none';
        return;
    }

    try {
        const found = await findSpaceData(searchString);
        spaceContainerElement.innerHTML = found.slice(0, 6).map(item => getHtmlForSpaceItem(item)).join('');
    } catch (error) {
        errorContainerElement.innerHTML = error.message;
    } finally {
        loadingContainerElement.style.display = 'none';
    }
}

async function findSpaceData(searchKey) {
    const searchLink = `${BASE_URL}search?q=${encodeURIComponent(searchKey)}`;

    const response = await fetch(searchLink)
        .then(res => res.json())
        .then(data => {
            if (!data.collection.items.length) {
                throw new Error('Брак інформації');
            }
            return data.collection.items;
        });

    return response;
}

function getHtmlForSpaceItem(spaceData) {
    const imgUrl = spaceData.links?.[0]?.href || 'images/no-image.png';
    const title = spaceData.data[0]?.title || 'Брак назви';
    const description = spaceData.data[0]?.description || 'Брак опису';

    return `
    <div class="space-item">
      <img src="${imgUrl}" alt="${title}" loading="lazy">
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  `;
}

function debounce(callback, wait) {
    let timer;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            clearTimeout(timer);
            callback(...args);
        }, wait);
    }
}