// Admin Authentication

class AdminAuth {
    constructor() {
        this.supabase = window.supabase;
        this.currentUser = null;
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupLoginForm();
        this.setupLogout();
    }

    async checkAuth() {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();

            if (error) throw error;

            if (session) {
                this.currentUser = session.user;
                this.showDashboard();
            } else {
                this.showLogin();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            this.showLogin();
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (!loginForm) return;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e);
        });
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'LOGGING IN...';

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.currentUser = data.user;
            this.showStatus('Login successful!', 'success');
            
            setTimeout(() => {
                this.showDashboard();
            }, 1000);

        } catch (error) {
            console.error('Login error:', error);
            this.showStatus(error.message || 'Login failed. Please check your credentials.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', async () => {
            await this.handleLogout();
        });
    }

    async handleLogout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            
            if (error) throw error;

            this.currentUser = null;
            this.showLogin();
            utils.showNotification('Logged out successfully', 'success');

        } catch (error) {
            console.error('Logout error:', error);
            utils.showNotification('Logout failed', 'error');
        }
    }

    showLogin() {
        const loadingScreen = document.getElementById('loading-screen');
        const loginScreen = document.getElementById('login-screen');
        const dashboard = document.getElementById('dashboard');

        if (loadingScreen) loadingScreen.style.display = 'none';
        if (loginScreen) loginScreen.style.display = 'flex';
        if (dashboard) dashboard.style.display = 'none';

        window.adminContent = null;
    }

    showDashboard() {
        const loadingScreen = document.getElementById('loading-screen');
        const loginScreen = document.getElementById('login-screen');
        const dashboard = document.getElementById('dashboard');

        if (loadingScreen) loadingScreen.style.display = 'none';
        if (loginScreen) loginScreen.style.display = 'none';
        if (dashboard) dashboard.style.display = 'flex';

        document.dispatchEvent(new CustomEvent('adminLoginSuccess'));
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('login-status');
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.className = `form-status ${type}`;
        statusElement.style.display = 'block';

        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Initialize auth
let adminAuth;
document.addEventListener('DOMContentLoaded', () => {
    adminAuth = new AdminAuth();
});

// Export
window.AdminAuth = AdminAuth;