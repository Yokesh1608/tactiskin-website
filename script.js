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



    // Terminal Typing Effect for Sections
    let problemStarted = false;
    let aboutStarted = false;
    let solutionStarted = false;

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
    // Hero animations are handled by CSS keyframes now

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
                
                // Trigger sequential typing for About Section
                if (entry.target.id === 'about' && !aboutStarted) {
                    aboutStarted = true;
                    const aboutList = document.getElementById('about-list');
                    if (aboutList) {
                        setTimeout(() => startTypingSequence(aboutList), 300);
                    }
                }
                
                // Trigger sequential typing for Solution Section
                if (entry.target.id === 'solution' && !solutionStarted) {
                    solutionStarted = true;
                    const solutionList = document.getElementById('solution-list');
                    if (solutionList) {
                        setTimeout(() => startTypingSequence(solutionList), 300);
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
