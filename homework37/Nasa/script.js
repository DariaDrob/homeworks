"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_KEY = 'RtxTNGwYhVzZc8e6vQqXgdU0BAoM5mNEnxtJcMs2';
const BASE_URL = 'https://images-api.nasa.gov/';
const searchTextElement = document.getElementById('searchText');
const spaceContainerElement = document.getElementById('spaceContainer');
const errorContainerElement = document.getElementById('errorContainer');
const loadingContainerElement = document.getElementById('loadingContainer');
searchTextElement.addEventListener('input', debounce(onTextInput, 500));
function onTextInput(event) {
    return __awaiter(this, void 0, void 0, function* () {
        spaceContainerElement.innerHTML = '';
        errorContainerElement.innerHTML = '';
        loadingContainerElement.style.display = 'block';
        const searchString = event.target.value.trim();
        if (!searchString) {
            errorContainerElement.innerHTML = 'Введіть запит';
            loadingContainerElement.style.display = 'none';
            return;
        }
        try {
            const found = yield findSpaceData(searchString);
            spaceContainerElement.innerHTML = found.slice(0, 6).map(item => getHtmlForSpaceItem(item)).join('');
        }
        catch (error) {
            errorContainerElement.innerHTML = error.message;
        }
        finally {
            loadingContainerElement.style.display = 'none';
        }
    });
}
function findSpaceData(searchKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchLink = `${BASE_URL}search?q=${encodeURIComponent(searchKey)}&api_key=${API_KEY}`;
        const response = yield fetch(searchLink);
        const data = yield response.json();
        if (!data.collection.items.length) {
            throw new Error('Брак інформації');
        }
        return data.collection.items;
    });
}
function getHtmlForSpaceItem(spaceData) {
    var _a, _b, _c, _d;
    const imgUrl = ((_b = (_a = spaceData.links) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.href) || 'images/no-image.png';
    const title = ((_c = spaceData.data[0]) === null || _c === void 0 ? void 0 : _c.title) || 'Брак назви';
    const description = ((_d = spaceData.data[0]) === null || _d === void 0 ? void 0 : _d.description) || 'Брак опису';
    return `
        <div class="space-item">
            <img src="${imgUrl}" alt="${title}" loading="lazy">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;
}
function debounce(callback, wait) {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            timer = null;
            callback.apply(this, args);
        }, wait);
    };
}
//# sourceMappingURL=script.js.map