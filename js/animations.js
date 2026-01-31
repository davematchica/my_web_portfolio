// Animation Controllers

// Typing animation for code display
class TypeWriter {
    constructor(element, texts, speed = 50) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    start() {
        this.type();
    }
}

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Scroll reveal animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Parallax effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', utils.throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }, 10));
}

// Mouse follow effect
function initMouseFollow() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--color-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.15s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorDot.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--color-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        display: none;
    `;
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.display = 'block';
        cursorDot.style.display = 'block';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;

        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        cursorDot.style.left = dotX - 4 + 'px';
        cursorDot.style.top = dotY - 4 + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .hover-target');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'var(--color-secondary)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'var(--color-primary)';
        });
    });
}

// Glitch effect
function createGlitchEffect(element, duration = 300) {
    element.classList.add('glitch');
    setTimeout(() => {
        element.classList.remove('glitch');
    }, duration);
}

// Stagger animation
function staggerAnimation(elements, animationClass, delay = 100) {
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add(animationClass);
        }, index * delay);
    });
}

// Initialize all animations
function initAnimations() {
    // Initialize scroll reveal
    initScrollReveal();

    // Initialize parallax
    initParallax();

    // Initialize custom cursor (optional, can be toggled)
    if (window.innerWidth > 768) {
        // initMouseFollow(); // Uncomment to enable custom cursor
    }

    // Code typing animation
    const codeElement = document.getElementById('code-animation');
    if (codeElement) {
        const codeTexts = [
            'function buildWebsite() {\n  return "awesome";\n}',
            'const skills = [\n  "HTML", "CSS", "JS"\n];',
            'while (learning) {\n  keepCoding();\n}',
            'if (problem) {\n  solve(problem);\n}'
        ];
        const typewriter = new TypeWriter(codeElement, codeTexts, 60);
        typewriter.start();
    }

    // Animate stats when in view
    const statCards = document.querySelectorAll('.stat-card');
    utils.observeElements('.stat-card', (element) => {
        const numberElement = element.querySelector('.stat-number');
        const target = parseInt(numberElement.dataset.target) || 0;
        animateCounter(numberElement, target);
        element.classList.add('animate-scale-in');
    });

    // Add entrance animations to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        
        utils.observeElements(`#${section.id}`, (el) => {
            el.style.transition = 'all 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });

    // Stagger animation for project cards
    utils.observeElements('.project-card', (element) => {
        element.classList.add('animate-fade-in-up');
    });

    // Stagger animation for skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    if (skillCards.length > 0) {
        const firstSkillCard = skillCards[0];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    staggerAnimation(skillCards, 'animate-scale-in', 50);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(firstSkillCard);
    }
}

// Export animation functions
window.animations = {
    TypeWriter,
    animateCounter,
    initScrollReveal,
    initParallax,
    initMouseFollow,
    createGlitchEffect,
    staggerAnimation,
    initAnimations
};