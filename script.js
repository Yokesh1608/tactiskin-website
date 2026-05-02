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



    // Working Principle Log Typing
    const logText = "When impact force is applied, Ecoflex distributes pressure across the grid. Velostat reduces resistance (30kΩ to 5kΩ). Voltage divider converts it into signals. Arduino scans 8×8 grid at ~25Hz. Data is visualized as heatmap.";
    const logContainer = document.getElementById('log-text');
    let logIndex = 0;
    let logStarted = false;

    function typeLog() {
        if (logIndex < logText.length) {
            logContainer.textContent += logText.charAt(logIndex);
            logIndex++;
            setTimeout(typeLog, 20); // Faster system log speed
        }
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
                
                // Trigger log typing if it's the working principle section
                if (entry.target.id === 'working-principle' && !logStarted) {
                    logStarted = true;
                    setTimeout(typeLog, 500);
                }
                
                // Unobserve once visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-container').forEach(section => {
        sectionObserver.observe(section);
    });

    // Heatmap Simulation
    const heatmapGrid = document.getElementById('heatmap-grid');
    const cells = [];
    
    // Create 64 cells
    for (let i = 0; i < 64; i++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        heatmapGrid.appendChild(cell);
        cells.push(cell);
    }

    // Color mapping function (0 to 1) -> rgb
    function getHeatmapColor(value) {
        // Value: 0 (Blue) -> 0.33 (Green) -> 0.66 (Yellow) -> 1 (Red)
        if (value < 0.33) {
            // Blue to Green
            const p = value / 0.33;
            return `rgb(0, ${Math.floor(255 * p)}, ${Math.floor(255 * (1 - p))})`;
        } else if (value < 0.66) {
            // Green to Yellow
            const p = (value - 0.33) / 0.33;
            return `rgb(${Math.floor(255 * p)}, 255, 0)`;
        } else {
            // Yellow to Red
            const p = (value - 0.66) / 0.34;
            return `rgb(255, ${Math.floor(255 * (1 - p))}, 0)`;
        }
    }

    // Simulate pressure waves
    let baseValues = new Array(64).fill(0);
    let targetValues = new Array(64).fill(0);
    
    function generateImpact() {
        // Random center for impact
        const cx = Math.floor(Math.random() * 8);
        const cy = Math.floor(Math.random() * 8);
        const intensity = 0.5 + Math.random() * 0.5; // 0.5 to 1.0
        const radius = 1 + Math.random() * 2; // 1 to 3
        
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const index = y * 8 + x;
                const dist = Math.sqrt(Math.pow(cx - x, 2) + Math.pow(cy - y, 2));
                
                if (dist < radius) {
                    // Apply impact based on distance
                    const impact = intensity * (1 - dist/radius);
                    targetValues[index] = Math.min(1, targetValues[index] + impact);
                }
            }
        }
    }
    
    function updateHeatmap() {
        // Decay target values
        for (let i = 0; i < 64; i++) {
            targetValues[i] = Math.max(0, targetValues[i] - 0.05); // Decay rate
            
            // Interpolate base towards target for smooth transition
            baseValues[i] += (targetValues[i] - baseValues[i]) * 0.2;
            
            // Add slight random noise simulating sensor noise
            let noise = (Math.random() * 0.1) - 0.05;
            let displayValue = Math.max(0, Math.min(1, baseValues[i] + noise));
            
            // Set color
            cells[i].style.backgroundColor = getHeatmapColor(displayValue);
        }
        
        // Randomly trigger new impacts
        if (Math.random() < 0.1) { // 10% chance per frame to generate impact
            generateImpact();
        }
        
        // Run at approx 25Hz (40ms)
        setTimeout(updateHeatmap, 40);
    }
    
    // Start simulation
    updateHeatmap();
});
