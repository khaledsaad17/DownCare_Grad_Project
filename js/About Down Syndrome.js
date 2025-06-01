document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn?.addEventListener('click', () => navLinks.classList.toggle('active'));
    
    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('click', () => navLinks.classList.remove('active'));
    });
    
    // Language toggle
    const toggleLang = (lang) => {
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.querySelectorAll('.lang-ar').forEach(el => el.classList.toggle('active', lang === 'ar'));
        document.querySelectorAll('.lang-en').forEach(el => el.classList.toggle('active', lang === 'en'));
        document.getElementById('en-btn').classList.toggle('active', lang === 'en');
        document.getElementById('ar-btn').classList.toggle('active', lang === 'ar');
    };
    
    document.getElementById('en-btn')?.addEventListener('click', () => toggleLang('en'));
    document.getElementById('ar-btn')?.addEventListener('click', () => toggleLang('ar'));
    
    // Animate elements on scroll
    const animateOnScroll = (elements, animation, threshold = 0.1) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `${animation} 1s ease-out`;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold });
        
        elements.forEach((el, i) => {
            if (el.classList.contains('progress-fill')) {
                el.style.width = '0';
                el.dataset.width = el.style.width;
            }
            el.style.animationDelay = `${i * 0.1}s`;
            observer.observe(el);
        });
    };
    
    animateOnScroll(document.querySelectorAll('.progress-fill'), 'widthGrow');
    animateOnScroll(document.querySelectorAll('.section'), 'slideInLeft');
});