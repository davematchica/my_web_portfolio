// Admin Dashboard Main

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Admin Dashboard initializing...');
    
    // Hide loading screen after auth check
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            loadingScreen.style.display = 'none';
        }
    }, 2000);
});

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
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="
                        (${onConfirm.toString()})();
                        this.closest('.modal').remove();
                    ">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
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

            utils.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            utils.showNotification('Failed to export data', 'error');
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