const imgsLinks = [
    '1.jpg',
    '2.png',
    '3.png',
    '4.jpg'
];

let currentSlide = 0;
const slideCount = imgsLinks.length;
let isSliding = false;
let slidingIntervalId;
const slideTime = 3000; // 3 сек

const imgContainerElem = document.querySelector('#slider .image-container');
const leftElem = document.querySelector('#slider .left');
const rightElem = document.querySelector('#slider .right');
const slideButtonsElem = document.querySelector('#slider .slide-buttons');
const startStopElem = document.querySelector('#slider .start-sliding-button');


function generateImgs() {
    imgContainerElem.innerHTML = imgsLinks.map(img => `<img src="img/${img}" alt="">`).join('');
}

function generateDots() {
    slideButtonsElem.innerHTML = imgsLinks.map((_, index) =>
        `<div class="slide-button ${index === 0 ? 'active' : ''}" data-img="${index}"></div>`
    ).join('');
}


function refreshSlide() {
    imgContainerElem.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelector('.slide-button.active')?.classList.remove('active');
    document.querySelector(`.slide-button[data-img="${currentSlide}"]`).classList.add('active');
}


function onLeftClick() {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    refreshSlide();
}

function onRightClick() {
    currentSlide = (currentSlide + 1) % slideCount;
    refreshSlide();
}

function onDotClick(event) {
    if (event.target.classList.contains('slide-button')) {
        currentSlide = parseInt(event.target.dataset.img);
        refreshSlide();
    }
}

function startStopSliding() {
    isSliding = !isSliding;
    startStopElem.classList.toggle('stopped');

    if (isSliding) {
        slidingIntervalId = setInterval(onRightClick, slideTime);
    } else {
        clearInterval(slidingIntervalId);
    }
}


function onKeyPress(event) {
    if (event.key === 'ArrowLeft') onLeftClick();
    if (event.key === 'ArrowRight') onRightClick();
}


let startX = 0;

function onTouchStart(event) {
    startX = event.touches[0].clientX;
}

function onTouchEnd(event) {
    let endX = event.changedTouches[0].clientX;
    if (startX - endX > 50) onRightClick();
    if (startX - endX < -50) onLeftClick();
}

leftElem.addEventListener('click', onLeftClick);
rightElem.addEventListener('click', onRightClick);
slideButtonsElem.addEventListener('click', onDotClick);
startStopElem.addEventListener('click', startStopSliding);
document.addEventListener('keydown', onKeyPress);
imgContainerElem.addEventListener('touchstart', onTouchStart);
imgContainerElem.addEventListener('touchend', onTouchEnd);

generateImgs();
generateDots();
refreshSlide();