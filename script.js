// Smooth scrolling for navigation links
function smoothScroll() {
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 60;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Navbar scroll effect - darkens background on scroll
function navbarScrollEffect() {
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(0, 0, 0, 0.95)';
      navbar.style.borderBottom = '1px solid #8AFF00';
    } else {
      navbar.style.background = 'black';
      navbar.style.borderBottom = 'none';
    }
  });
}

// Scroll reveal animation - fade in and slide up sections
function revealOnScroll() {
  const elements = document.querySelectorAll('.section, .team-card, button');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(element => {
    observer.observe(element);
  });
}

// Hero text glow and flicker animation
function heroTextAnimation() {
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) {
    heroH1.classList.add('hero-glow');
  }
}

// Button hover glow effect
function addButtonGlow() {
  const buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 0 20px #8AFF00';
      this.style.transition = 'all 0.3s ease';
    });

    button.addEventListener('mouseleave', function() {
      this.style.boxShadow = 'none';
    });
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("TactiSkin website loaded");
  revealOnScroll();
  smoothScroll();
  navbarScrollEffect();
  heroTextAnimation();
  addButtonGlow();
});
