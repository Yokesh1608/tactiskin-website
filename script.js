// Scroll reveal animation
function revealOnScroll() {
    const elements = document.querySelectorAll('.section-content, .feature-item, .problem-point, .solution-feature, .flow-step, .team-member');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'animate');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth scrolling for navigation links
function smoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar background on scroll
function navbarScrollEffect() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    });
}

// Floating animation for hero visual
function floatingAnimation() {
    const floatingGrid = document.querySelector('.floating-grid');

    if (floatingGrid) {
        setInterval(() => {
            floatingGrid.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 10}px)`;
        }, 50);
    }
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    smoothScroll();
    navbarScrollEffect();
    floatingAnimation();
});

// Add loading animation for hero elements
window.addEventListener('load', () => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.opacity = '1';
    }
});
