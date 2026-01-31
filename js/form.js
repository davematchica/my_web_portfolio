// Contact Form Handler

class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.supabase = window.supabase;
        this.tables = window.TABLES;
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input animations
        this.setupInputAnimations();
    }

    setupInputAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add placeholder attribute for CSS :placeholder-shown selector
            input.setAttribute('placeholder', ' ');
            
            // Add focus effects
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            created_at: new Date().toISOString()
        };

        // Validate
        if (!this.validateForm(data)) {
            return;
        }

        // Disable submit button
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';

        try {
            // Save to Supabase
            const { error } = await this.supabase
                .from(this.tables.MESSAGES)
                .insert([data]);

            if (error) throw error;

            // Show success message
            this.showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            this.form.reset();

            // Optional: Send email notification (requires backend setup)
            // await this.sendEmailNotification(data);

        } catch (error) {
            console.error('Error submitting form:', error);
            this.showStatus('Failed to send message. Please try again or contact me directly.', 'error');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    validateForm(data) {
        // Check if all fields are filled
        if (!data.name || !data.email || !data.subject || !data.message) {
            this.showStatus('Please fill in all fields.', 'error');
            return false;
        }

        // Validate name
        if (data.name.trim().length < 2) {
            this.showStatus('Please enter a valid name.', 'error');
            return false;
        }

        // Validate email
        if (!utils.isValidEmail(data.email)) {
            this.showStatus('Please enter a valid email address.', 'error');
            return false;
        }

        // Validate subject
        if (data.subject.trim().length < 3) {
            this.showStatus('Subject must be at least 3 characters long.', 'error');
            return false;
        }

        // Validate message
        if (data.message.trim().length < 10) {
            this.showStatus('Message must be at least 10 characters long.', 'error');
            return false;
        }

        return true;
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('form-status');
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.className = `form-status ${type}`;
        statusElement.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);

        // Also show notification
        utils.showNotification(message, type);
    }

    // Optional: Send email notification using a backend service
    async sendEmailNotification(data) {
        // This would require a backend endpoint or service like SendGrid, Mailgun, etc.
        // Example implementation:
        /*
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Email notification failed');
            }
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
        */
    }
}

// Initialize contact form
let contactForm;
document.addEventListener('DOMContentLoaded', () => {
    contactForm = new ContactForm('contact-form');
});

// Export
window.ContactForm = ContactForm;