// Admin Dashboard Main

// CRITICAL: Initialize admin content after successful login
document.addEventListener('adminLoginSuccess', function() {
    console.log('Admin: Login successful, initializing content manager');
    
    // Small delay to ensure dashboard is visible
    setTimeout(() => {
        if (typeof window.initializeAdminContent === 'function') {
            window.initializeAdminContent();
        } else {
            console.error('Admin: initializeAdminContent function not found');
        }
        
        // Initialize mobile menu after content loads
        initMobileMenu();
    }, 100);
});

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Admin Dashboard initializing...');
    
    // Try to initialize mobile menu if dashboard already visible
    setTimeout(() => {
        const dashboard = document.getElementById('dashboard');
        if (dashboard && dashboard.style.display !== 'none') {
            initMobileMenu();
        }
    }, 500);
});

// Close modals on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close project modal
        const projectModal = document.getElementById('project-modal');
        if (projectModal && projectModal.style.display === 'flex') {
            if (window.adminContent && typeof window.adminContent.closeProjectModal === 'function') {
                window.adminContent.closeProjectModal();
            }
        }
        
        // Close skill modal
        const skillModal = document.getElementById('skill-modal');
        if (skillModal && skillModal.style.display === 'flex') {
            if (window.adminContent && typeof window.adminContent.closeSkillModal === 'function') {
                window.adminContent.closeSkillModal();
            }
        }
        
        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            closeMobileSidebar();
        }
    }
});

// Close modals on background click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Mobile Menu Functionality
function initMobileMenu() {
    console.log('Initializing mobile menu...');
    
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navItems = document.querySelectorAll('.nav-item');
    
    console.log('Mobile menu elements:', {
        menuToggle: !!menuToggle,
        sidebar: !!sidebar,
        sidebarClose: !!sidebarClose,
        sidebarOverlay: !!sidebarOverlay,
        navItems: navItems.length
    });
    
    if (!menuToggle || !sidebar) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    // Remove existing listeners to avoid duplicates
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    // Toggle sidebar
    newMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Burger clicked!');
        toggleMobileSidebar();
    });
    
    // Close sidebar when close button clicked
    if (sidebarClose) {
        const newSidebarClose = sidebarClose.cloneNode(true);
        sidebarClose.parentNode.replaceChild(newSidebarClose, sidebarClose);
        
        newSidebarClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileSidebar();
        });
    }
    
    // Close sidebar when overlay clicked
    if (sidebarOverlay) {
        const newOverlay = sidebarOverlay.cloneNode(true);
        sidebarOverlay.parentNode.replaceChild(newOverlay, sidebarOverlay);
        
        newOverlay.addEventListener('click', function() {
            closeMobileSidebar();
        });
    }
    
    // Close sidebar when nav item clicked (mobile only)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                setTimeout(closeMobileSidebar, 100);
            }
        });
    });
    
    console.log('Mobile menu initialized successfully');
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (!sidebar) return;
    
    const isActive = sidebar.classList.contains('active');
    console.log('Toggling sidebar, currently active:', isActive);
    
    if (isActive) {
        sidebar.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    } else {
        sidebar.classList.add('active');
        if (menuToggle) menuToggle.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (sidebar) sidebar.classList.remove('active');
    if (menuToggle) menuToggle.classList.remove('active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
}

// Global admin utilities
window.adminUtils = {
    // Confirm delete action
    confirmDelete: (itemName) => {
        return confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`);
    },

    // Format date for display
    formatDateTime: (date) => {
        const d = new Date(date);
        return d.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Validate form
    validateForm: (formElement) => {
        const inputs = formElement.querySelectorAll('[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ff0000';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        return isValid;
    },

    // Show confirmation modal
    showConfirmModal: (title, message, onConfirm) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body" style="padding: 1.5rem;">
                    <p>${message}</p>
                </div>
                <div class="form-actions" style="padding: 1.5rem; padding-top: 0;">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" id="confirm-btn">Confirm</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup confirm button
        const confirmBtn = modal.querySelector('#confirm-btn');
        confirmBtn.onclick = () => {
            onConfirm();
            modal.remove();
        };
        
        return modal;
    },

    // Export data as JSON
    exportData: async (tableName) => {
        try {
            const { data, error } = await window.supabase
                .from(tableName)
                .select('*');

            if (error) throw error;

            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${tableName}_export_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            if (window.utils && window.utils.showNotification) {
                window.utils.showNotification('Data exported successfully!', 'success');
            } else {
                alert('Data exported successfully!');
            }
        } catch (error) {
            console.error('Export error:', error);
            if (window.utils && window.utils.showNotification) {
                window.utils.showNotification('Failed to export data', 'error');
            } else {
                alert('Failed to export data');
            }
        }
    }
};

// Console styling
console.log(
    '%c🔐 Admin Dashboard',
    'font-size: 24px; font-weight: bold; color: #00f0ff;'
);
console.log(
    '%cWelcome to the admin panel',
    'font-size: 14px; color: #a0aec0;'
);