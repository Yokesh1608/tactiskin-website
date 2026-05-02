document.addEventListener('DOMContentLoaded', () => {
    // Navbar effect on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(166, 255, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });



    // Terminal Typing Effect for Problem Section
    let problemStarted = false;

    function startTypingSequence(container) {
        const lines = container.querySelectorAll('.type-line');
        if (!lines || lines.length === 0) return;
        
        let currentLine = 0;

        function typeNextLine() {
            if (currentLine < lines.length) {
                const lineElem = lines[currentLine];
                lineElem.classList.add('active', 'typing');
                
                const text = lineElem.getAttribute('data-text') || "";
                const textContainer = lineElem.querySelector('.typing-text');
                
                if (!textContainer) {
                    currentLine++;
                    typeNextLine();
                    return;
                }
                
                let charIndex = 0;
                // Clear any existing text just in case
                textContainer.textContent = "";
                
                function typeChar() {
                    if (charIndex < text.length) {
                        textContainer.textContent += text.charAt(charIndex);
                        charIndex++;
                        // Randomize typing speed slightly for realism
                        const typeSpeed = 10 + Math.random() * 15;
                        setTimeout(typeChar, typeSpeed);
                    } else {
                        lineElem.classList.remove('typing');
                        lineElem.classList.add('done');
                        currentLine++;
                        setTimeout(typeNextLine, 300); // Delay between lines
                    }
                }
                
                setTimeout(typeChar, 50); // Start delay for the line
            }
        }

        typeNextLine();
    }

    // Hero Visual Matrix Animation
    const heroMatrix = document.querySelector('.hero-visual-matrix');
    if (heroMatrix) {
        const matrixCells = [];
        for (let i = 0; i < 64; i++) {
            const cell = document.createElement('div');
            cell.className = 'hero-matrix-cell';
            heroMatrix.appendChild(cell);
            matrixCells.push(cell);
        }

        function animateHeroMatrix() {
            // Fade out randomly
            matrixCells.forEach(cell => {
                if (Math.random() < 0.1) {
                    cell.style.backgroundColor = 'rgba(166, 255, 0, 0.02)';
                    cell.style.boxShadow = 'none';
                }
            });

            // Light up random cells (soft glow)
            const numActive = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numActive; i++) {
                const index = Math.floor(Math.random() * 64);
                const color = 'rgba(166, 255, 0, 0.3)';
                matrixCells[index].style.backgroundColor = color;
                matrixCells[index].style.boxShadow = `0 0 10px ${color}`;
            }

            setTimeout(animateHeroMatrix, 200); // Gentle updates
        }
        
        animateHeroMatrix();
    }

    // Intersection Observer for scroll fade-ins
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
                
                // Trigger sequential typing for Problem Statement
                if (entry.target.id === 'problem' && !problemStarted) {
                    problemStarted = true;
                    const problemList = document.getElementById('problem-list');
                    if (problemList) {
                        setTimeout(() => startTypingSequence(problemList), 300);
                    }
                }
                
                // Unobserve once visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-container').forEach(section => {
        sectionObserver.observe(section);
    });


});
