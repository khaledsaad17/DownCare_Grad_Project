// Mobile menu toggle functionality
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navLinks = document.querySelector('.nav-links');
            
            mobileMenuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });
            
            // Close mobile menu when a link is clicked
            const navItems = document.querySelectorAll('.nav-links a');
            navItems.forEach(item => {
                item.addEventListener('click', function() {
                    navLinks.classList.remove('active');
                });
            });
            
            // Language toggle functionality
            const enBtn = document.getElementById('en-btn');
            const arBtn = document.getElementById('ar-btn');
            
            enBtn.addEventListener('click', function() {
                // Switch to English
                document.body.setAttribute('dir', 'ltr');
                enBtn.classList.add('active');
                arBtn.classList.remove('active');
                
                // Hide all Arabic elements and show English
                document.querySelectorAll('.lang-ar').forEach(el => {
                    el.classList.remove('active');
                });
                document.querySelectorAll('.lang-en').forEach(el => {
                    el.classList.add('active');
                });
            });
            
            arBtn.addEventListener('click', function() {
                // Switch to Arabic
                document.body.setAttribute('dir', 'rtl');
                arBtn.classList.add('active');
                enBtn.classList.remove('active');
                
                // Hide all English elements and show Arabic
                document.querySelectorAll('.lang-en').forEach(el => {
                    el.classList.remove('active');
                });
                document.querySelectorAll('.lang-ar').forEach(el => {
                    el.classList.add('active');
                });
            });
            
            // Animate progress bars on scroll
            const progressBars = document.querySelectorAll('.progress-fill');
            
            // Initially set width to 0
            progressBars.forEach(bar => {
                bar.style.width = '0';
            });
            
            // Animate when scrolled to
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const width = entry.target.style.width;
                        entry.target.style.width = width; 
                        entry.target.style.width = entry.target.getAttribute('data-width') || '100%';
                    }
                });
            }, {threshold: 0.5});
            
            progressBars.forEach(bar => {
                observer.observe(bar);
                const originalWidth = bar.style.width;
                bar.setAttribute('data-width', originalWidth);
                bar.style.width = '0';
            });
            const sections = document.querySelectorAll('.section');
            
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'slideInLeft 1s ease-out';
                    }
                });
            }, {threshold: 0.1});
            
            sections.forEach((section, index) => {
                sectionObserver.observe(section);
                // Add delay based on index
                section.style.animationDelay = `${index * 0.1}s`;
            });
        });