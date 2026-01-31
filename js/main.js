// Main Application Entry Point

// App configuration
const APP_CONFIG = {
    loadingDuration: 1500,
    animationEnabled: true,
    customCursorEnabled: false // Set to true to enable custom cursor
};

// App state
const appState = {
    isLoading: true,
    currentSection: 'home'
};

// Initialize app
async function initApp() {
    console.log('🚀 Initializing portfolio...');

    try {
        // Show loading screen
        showLoadingScreen();

        // Wait for minimum loading time
        await new Promise(resolve => setTimeout(resolve, APP_CONFIG.loadingDuration));

        // Initialize all modules
        await initializeModules();

        // Hide loading screen
        hideLoadingScreen();

        // Mark app as loaded
        appState.isLoading = false;

        console.log('✅ Portfolio initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        hideLoadingScreen();
    }
}

// Show loading screen
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Initialize all modules
async function initializeModules() {
    // Initialize animations
    if (APP_CONFIG.animationEnabled && window.animations) {
        window.animations.initAnimations();
    }

    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Handle hash navigation on load
    handleHashNavigation();
}

// Handle hash navigation
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        setTimeout(() => {
            const sectionId = hash.slice(1);
            const section = document.getElementById(sectionId);
            if (section && window.navigationController) {
                window.navigationController.scrollToSection(sectionId);
            }
        }, 100);
    }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 User left the page');
    } else {
        console.log('👀 User returned to the page');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    utils.showNotification('Connection restored', 'success');
});

window.addEventListener('offline', () => {
    utils.showNotification('You are offline', 'warning');
});

// Handle errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'H' to go home
    if (e.key === 'h' && !e.ctrlKey && !e.metaKey && !e.target.matches('input, textarea')) {
        window.navigationController?.scrollToSection('home');
    }
    
    // Press 'C' to go to contact
    if (e.key === 'c' && !e.ctrlKey && !e.metaKey && !e.target.matches('input, textarea')) {
        window.navigationController?.scrollToSection('contact');
    }
    
    // Press 'P' to go to projects
    if (e.key === 'p' && !e.ctrlKey && !e.metaKey && !e.target.matches('input, textarea')) {
        window.navigationController?.scrollToSection('projects');
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    console.log('🎉 Konami code activated!');
    utils.showNotification('🎉 You found the secret! Developer mode activated!', 'success', 5000);
    
    // Add some fun effects
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Performance metrics:');
            console.log('- Page load time:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
            console.log('- DOM content loaded:', Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart), 'ms');
        }, 0);
    });
}

// Log browser info
console.log('🌐 Browser:', navigator.userAgent);
console.log('📱 Device:', /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop');
console.log('🎨 Color scheme:', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light');

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export app
window.app = {
    config: APP_CONFIG,
    state: appState,
    init: initApp
};

// Console message for developers
console.log(
    '%c🚀 Portfolio Website',
    'font-size: 24px; font-weight: bold; color: #00f0ff;'
);
console.log(
    '%cBuilt with ❤️ using HTML, CSS, JavaScript & Supabase',
    'font-size: 14px; color: #a0aec0;'
);
console.log(
    '%cInterested in the code? Check out the source!',
    'font-size: 12px; color: #718096;'
);