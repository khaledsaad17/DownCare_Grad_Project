document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // 1. Change navbar style on scroll
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // 2. Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
    
    // 3. Set active link based on current page
    function setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop();
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Remove active class first
            link.classList.remove('active');
            
            // Set active class if paths match
            if (
                currentPath === linkPath || 
                (currentPath === '' && linkPath === 'index.html') ||
                (currentPath.includes('Doctors') && linkPath.includes('Doctors'))
            ) {
                link.classList.add('active');
            }
        });
    }
    
    // Initialize
    handleScroll();
    setActiveLink();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
});