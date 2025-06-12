class DownCareApp {
    constructor() {
        this.initComponents();
    }
    initComponents() {
        new HeroCarousel();
        new FeedbackSlider();
        new ArticlesSlider();
    }
}

class HeroCarousel {
    constructor() {
        this.carouselElement = document.getElementById('heroCarousel');
        this.init();
    }
    init() {
        if (!this.carouselElement) return;
        this.carousel = new bootstrap.Carousel(this.carouselElement, {
            interval: 5000,
            ride: 'carousel',
            wrap: true
        });
    }
}

class ApiService {
    static BASE_URL = 'https://downcare.azurewebsites.net/api';

    static ENDPOINTS = {
        FEEDBACK: '/Feedback',
        ARTICLES: '/Article'
    };

    static async fetchFeedback() {
        return this._fetchData(this.ENDPOINTS.FEEDBACK);
    }

    static async fetchArticles() {
        return this._fetchData(this.ENDPOINTS.ARTICLES);
    }

    static async _fetchData(endpoint) {
        try {
            const response = await fetch(`${this.BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch data from ${endpoint}:`, error);
            throw error;
        }
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

class BaseSlider {
    constructor(containerSelector, autoPlayDelay = 5000) {
        this.container = document.querySelector(containerSelector);
        this.autoPlayDelay = autoPlayDelay;
        this.currentIndex = 0;
        this.interval = null;
        this.slides = [];
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.interval = setInterval(() => this.next(), this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    goTo(index) {
        if (this.slides.length <= 1) return;

        if (index < 0) index = this.slides.length - 1;
        if (index >= this.slides.length) index = 0;

        this.currentIndex = index;
        this.updateSlider();
    }

    updateSlider() {
        throw new Error('updateSlider method must be implemented');
    }

    handleError(message) {
        this.container.innerHTML = `
      <div class="error-message">
        <p>${message}</p>
      </div>
    `;
    }
}

class FeedbackSlider extends BaseSlider {
    constructor() {
        super('#feedback-slider', 5000);
        this.prevBtn = document.querySelector('.feedback-sec .prev');
        this.nextBtn = document.querySelector('.feedback-sec .next');
        this.init();
    }

    async init() {
        try {
            const data = await ApiService.fetchFeedback();
            this.slides = Array.isArray(data) ? data : data.data || [];
            this.renderSlides();
            this.setupEventListeners();
            this.startAutoPlay();
        } catch (error) {
            this.handleError('Failed to load feedback. Please try again later.');
        }
    }

    renderSlides() {
        if (this.slides.length === 0) {
            this.handleError('No feedback available at this time.');
            return;
        }

        this.container.innerHTML = this.slides
            .map((feedback, index) => {
                const date = feedback.dateTime ? formatDate(feedback.dateTime) : '';
                // Always use default photo for feedback
                const avatarHtml = `<img src="img/default-article.jpg" alt="Default User" class="author-avatar feedback-avatar">`;

                return `
          <div class="feedback-slide ${index === 0 ? 'active' : ''}">
            <div class="feedback-content">
              ${feedback.content || 'No feedback content available.'}
            </div>
            <div class="feedback-author">
              <div class="feedback-avatar">${avatarHtml}</div>
              <div class="feedback-info">
                <h4>${feedback.name || 'Anonymous User'}</h4>
                <p>${date}</p>
              </div>
            </div>
          </div>
        `;
            })
            .join('');
    }

    updateSlider() {
        const slides = this.container.querySelectorAll('.feedback-slide');
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === this.currentIndex);
        });
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.prev();
            this.startAutoPlay();
        });

        this.nextBtn.addEventListener('click', () => {
            this.next();
            this.startAutoPlay();
        });

        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }
}

class ArticlesSlider extends BaseSlider {
    constructor() {
        super('#articles-slider');
        this.prevBtn = document.querySelector('.prev-arrow');
        this.nextBtn = document.querySelector('.next-arrow');
        this.touchStartX = 0;
        this.init();
    }

    async init() {
        try {
            const data = await ApiService.fetchArticles();
            this.slides = Array.isArray(data) ? data : data.data || [];
            this.renderSlides();
            this.setupEventListeners();

            if (this.slides.length === 1) {
                document.querySelector('.articles-slider-container').classList.add('single-article');
            }

            window.addEventListener('resize', this.handleResize.bind(this));
        } catch (error) {
            this.handleError('Failed to load articles. Please try again later.');
        }
    }

    renderSlides() {
        this.container.innerHTML = this.slides
            .map((article) => {
                const date = article.dateTime ? formatDate(article.dateTime) : 'No date';
                // Always use default photo for articles
                return `
          <div class="article-slide">
            <div class="article-card">
              <div class="article-image">
                <img src="img/default-article.jpg" alt="${article.title}" loading="lazy">
              </div>
              <div class="article-content">
                <h3 class="article-title">Article</h3>
                <p class="article-excerpt">${article.content}</p>
                <div class="article-meta">
                  <span>${article.name || 'Anonymous Author'}</span>
                  <span>${date}</span>
                </div>
              </div>
            </div>
          </div>
        `;
            })
            .join('');
    }

    updateSlider() {
        if (!this.container.firstElementChild) return;

        const slideWidth = this.container.firstElementChild.offsetWidth;
        const gap = parseInt(window.getComputedStyle(this.container).gap) || 0;
        const offset = (slideWidth + gap) * this.currentIndex;

        this.container.style.transform = `translateX(-${offset}px)`;

        this.prevBtn.disabled = this.slides.length <= 1;
        this.nextBtn.disabled = this.slides.length <= 1;
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        this.container.addEventListener(
            'touchstart',
            (e) => {
                this.touchStartX = e.touches[0].clientX;
            },
            { passive: true }
        );

        this.container.addEventListener(
            'touchend',
            (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe(touchEndX);
            },
            { passive: true }
        );
    }

    handleSwipe(touchEndX) {
        const threshold = 50;
        const diff = this.touchStartX - touchEndX;

        if (diff > threshold) this.next();
        else if (diff < -threshold) this.prev();
    }

    handleResize() {
        this.updateSlider();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DownCareApp();
});