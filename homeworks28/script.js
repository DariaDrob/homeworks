function SliderPrototype(containerId, config = {}) {
    this.container = document.getElementById(containerId);
    this.images = config.images || ['1.jpg', '2.png', '3.png', '4.jpg'];
    this.slideTime = config.slideTime || 3000;
    this.showDots = config.showDots !== false; // По умолчанию true
    this.currentSlide = 0;
    this.isSliding = false;
    this.slidingIntervalId = null;

    this.init();
}

SliderPrototype.prototype.init = function () {
    this.container.classList.add('slider');
    this.container.innerHTML = `
        <div class="left">❮</div>
        <div class="image-cell">
            <div class="image-container"></div>
        </div>
        <div class="right">❯</div>
        <div class="start-sliding">
            <div class="start-sliding-button stopped"></div>
        </div>
        ${this.showDots ? '<div class="slide-buttons"></div>' : ''}
    `;

    this.imgContainer = this.container.querySelector('.image-container');
    this.leftBtn = this.container.querySelector('.left');
    this.rightBtn = this.container.querySelector('.right');
    this.startStopBtn = this.container.querySelector('.start-sliding-button');
    this.dotsContainer = this.container.querySelector('.slide-buttons');

    this.generateImages();
    this.generateDots();
    this.attachEvents();
    this.refreshSlide();
};

SliderPrototype.prototype.generateImages = function () {
    this.imgContainer.innerHTML = this.images.map(img =>
        `<img src="img/${img}" alt="Slide" loading="lazy">`).join('');
};

SliderPrototype.prototype.generateDots = function () {
    if (!this.showDots) return;
    this.dotsContainer.innerHTML = this.images.map((_, i) =>
        `<div class="slide-button ${i === 0 ? 'active' : ''}" data-img="${i}"></div>`).join('');
};

SliderPrototype.prototype.refreshSlide = function () {
    this.imgContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    if (this.showDots) {
        this.dotsContainer.querySelector('.active')?.classList.remove('active');
        this.dotsContainer.querySelector(`[data-img="${this.currentSlide}"]`)?.classList.add('active');
    }
};

SliderPrototype.prototype.nextSlide = function () {
    this.currentSlide = (this.currentSlide + 1) % this.images.length;
    this.refreshSlide();
};

SliderPrototype.prototype.prevSlide = function () {
    this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
    this.refreshSlide();
};

SliderPrototype.prototype.startStopSliding = function () {
    this.isSliding = !this.isSliding;
    this.startStopBtn.classList.toggle('stopped');
    if (this.isSliding) {
        this.slidingIntervalId = setInterval(() => this.nextSlide(), this.slideTime);
    } else {
        clearInterval(this.slidingIntervalId);
    }
};

SliderPrototype.prototype.attachEvents = function () {
    this.leftBtn.addEventListener('click', () => this.prevSlide());
    this.rightBtn.addEventListener('click', () => this.nextSlide());
    this.startStopBtn.addEventListener('click', () => this.startStopSliding());
    if (this.showDots) {
        this.dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('slide-button')) {
                this.currentSlide = parseInt(e.target.dataset.img);
                this.refreshSlide();
            }
        });
    }
};

function TouchSlider(containerId, config) {
    SliderPrototype.call(this, containerId, config);
}

TouchSlider.prototype = Object.create(SliderPrototype.prototype);
TouchSlider.prototype.constructor = TouchSlider;

TouchSlider.prototype.attachEvents = function () {
    SliderPrototype.prototype.attachEvents.call(this);
    let startX = 0;
    this.imgContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    this.imgContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) this.nextSlide();
        if (startX - endX < -50) this.prevSlide();
    });
};

const protoSlider = new TouchSlider('slider-prototype', {
    images: ['1.jpg', '2.png', '3.png', '4.jpg'],
    slideTime: 4000,
    showDots: true
});


class SliderClass {
    constructor(containerId, config = {}) {
        this.container = document.getElementById(containerId);
        this.images = config.images || ['1.jpg', '2.png', '3.png', '4.jpg'];
        this.slideTime = config.slideTime || 3000;
        this.showDots = config.showDots !== false;
        this.currentSlide = 0;
        this.isSliding = false;
        this.slidingIntervalId = null;

        this.init();
    }

    init() {
        this.container.classList.add('slider');
        this.container.innerHTML = `
            <div class="left">❮</div>
            <div class="image-cell">
                <div class="image-container"></div>
            </div>
            <div class="right">❯</div>
            <div class="start-sliding">
                <div class="start-sliding-button stopped"></div>
            </div>
            ${this.showDots ? '<div class="slide-buttons"></div>' : ''}
        `;

        this.imgContainer = this.container.querySelector('.image-container');
        this.leftBtn = this.container.querySelector('.left');
        this.rightBtn = this.container.querySelector('.right');
        this.startStopBtn = this.container.querySelector('.start-sliding-button');
        this.dotsContainer = this.container.querySelector('.slide-buttons');

        this.generateImages();
        this.generateDots();
        this.attachEvents();
        this.refreshSlide();
    }

    generateImages() {
        this.imgContainer.innerHTML = this.images.map(img =>
            `<img src="img/${img}" alt="Slide" loading="lazy">`).join('');
    }

    generateDots() {
        if (!this.showDots) return;
        this.dotsContainer.innerHTML = this.images.map((_, i) =>
            `<div class="slide-button ${i === 0 ? 'active' : ''}" data-img="${i}"></div>`).join('');
    }

    refreshSlide() {
        this.imgContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        if (this.showDots) {
            this.dotsContainer.querySelector('.active')?.classList.remove('active');
            this.dotsContainer.querySelector(`[data-img="${this.currentSlide}"]`)?.classList.add('active');
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.images.length;
        this.refreshSlide();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.images.length) % this.images.length;
        this.refreshSlide();
    }

    startStopSliding() {
        this.isSliding = !this.isSliding;
        this.startStopBtn.classList.toggle('stopped');
        if (this.isSliding) {
            this.slidingIntervalId = setInterval(() => this.nextSlide(), this.slideTime);
        } else {
            clearInterval(this.slidingIntervalId);
        }
    }

    pauseSliding() {
        if (this.isSliding) clearInterval(this.slidingIntervalId);
    }

    resumeSliding() {
        if (this.isSliding) this.slidingIntervalId = setInterval(() => this.nextSlide(), this.slideTime);
    }

    attachEvents() {
        this.leftBtn.addEventListener('click', () => this.prevSlide());
        this.rightBtn.addEventListener('click', () => this.nextSlide());
        this.startStopBtn.addEventListener('click', () => this.startStopSliding());
        if (this.showDots) {
            this.dotsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('slide-button')) {
                    this.currentSlide = parseInt(e.target.dataset.img);
                    this.refreshSlide();
                }
            });
        }
        // Тач-поддержка
        let startX = 0;
        this.imgContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.pauseSliding();
        });
        this.imgContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) this.nextSlide();
            if (startX - endX < -50) this.prevSlide();
            this.resumeSliding();
        });
        // Пауза при наведении
        this.container.addEventListener('mouseenter', () => this.pauseSliding());
        this.container.addEventListener('mouseleave', () => this.resumeSliding());
    }
}


const classSlider = new SliderClass('slider-class', {
    images: ['1.jpg', '2.png', '3.png', '4.jpg'],
    slideTime: 3000,
    showDots: true
});