        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Auto-open game if URL has hash
        document.addEventListener('DOMContentLoaded', function() {
            if (window.location.hash === '#happy-sad') {
                const modal = new bootstrap.Modal(document.getElementById('happySadModal'));
                modal.show();
            } else if (window.location.hash === '#scrambled-words') {
                const modal = new bootstrap.Modal(document.getElementById('scrambledWordsModal'));
                modal.show();
            } else if (window.location.hash === '#try-to-collect') {
                const modal = new bootstrap.Modal(document.getElementById('tryToCollectModal'));
                modal.show();
            }
            
            // Close modal when game is completed (example)
            const gameIframes = document.querySelectorAll('.game-modal iframe');
            gameIframes.forEach(iframe => {
                iframe.contentWindow.addEventListener('gameCompleted', function() {
                    const modal = bootstrap.Modal.getInstance(iframe.closest('.modal'));
                    modal.hide();
                });
            });
        });
        
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
