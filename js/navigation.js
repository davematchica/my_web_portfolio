// Navigation Controller

class Navigation {
    constructor() {
        this.nav = document.getElementById('main-nav');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        
        this.init();
    }

    init() {
        this.setupToggle();
        this.setupScrollEffect();
        this.setupActiveLinks();
        this.setupSmoothScroll();
    }

    setupToggle() {
        if (!this.navToggle || !this.navMenu) return;

        this.navToggle.addEventListener('click', () => {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.navToggle.classList.remove('active');
                this.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    setupScrollEffect() {
        let lastScroll = 0;

        window.addEventListener('scroll', utils.throttle(() => {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            // Hide/show nav on scroll (optional)
            // if (currentScroll > lastScroll && currentScroll > 500) {
            //     this.nav.style.transform = 'translateY(-100%)';
            // } else {
            //     this.nav.style.transform = 'translateY(0)';
            // }

            lastScroll = currentScroll;
        }, 100));
    }

    setupActiveLinks() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.setActiveLink(sectionId);
                    
                    // Update URL without scrolling
                    if (history.pushState) {
                        history.pushState(null, null, `#${sectionId}`);
                    }
                }
            });
        }, observerOptions);

        this.sections.forEach(section => observer.observe(section));
    }

    setActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navHeight = this.nav.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Handle scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    const navHeight = this.nav.offsetHeight;
                    window.scrollTo({
                        top: aboutSection.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            });
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = this.nav.offsetHeight;
            const targetPosition = section.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize navigation
let navigationController;
document.addEventListener('DOMContentLoaded', () => {
    navigationController = new Navigation();
});

// Export
window.Navigation = Navigation;