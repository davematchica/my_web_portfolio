// Admin Content Management

class AdminContent {
    constructor() {
        console.log('AdminContent: Constructor called');
        this.supabase = window.supabase;
        this.tables = window.TABLES;
        this.currentSection = 'overview';
        
        // Verify dependencies
        if (!this.supabase) {
            console.error('AdminContent: Supabase not initialized');
            return;
        }
        if (!this.tables) {
            console.error('AdminContent: TABLES not found');
            return;
        }
        
        console.log('AdminContent: Dependencies verified, initializing...');
        this.init();
    }

    init() {
        console.log('AdminContent: Init called');
        this.setupNavigation();
        this.loadSection('overview');
    }

    setupNavigation() {
        console.log('AdminContent: Setting up navigation');
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        console.log('AdminContent: Found nav items:', navItems.length);
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Load section
                const section = item.dataset.section;
                console.log('AdminContent: Loading section:', section);
                this.loadSection(section);
            });
        });
    }

    async loadSection(section) {
        console.log('AdminContent: loadSection called for:', section);
        this.currentSection = section;
        const contentBody = document.getElementById('content-body');
        const sectionTitle = document.getElementById('section-title');
        
        if (!contentBody) {
            console.error('AdminContent: content-body element not found');
            return;
        }

        // Show loading state
        contentBody.innerHTML = '<div style="padding: 2rem; text-align: center;"><p>Loading...</p></div>';

        // Update title
        const titles = {
            overview: 'Dashboard Overview',
            about: 'About Section',
            projects: 'Projects Management',
            skills: 'Skills Management',
            contact: 'Contact Information',
            messages: 'Messages Inbox'
        };
        
        if (sectionTitle) {
            sectionTitle.textContent = titles[section] || 'Dashboard';
        }

        // Load content based on section
        try {
            switch (section) {
                case 'overview':
                    await this.loadOverview();
                    break;
                case 'about':
                    await this.loadAboutEditor();
                    break;
                case 'projects':
                    await this.loadProjectsManager();
                    break;
                case 'skills':
                    await this.loadSkillsManager();
                    break;
                case 'contact':
                    await this.loadContactEditor();
                    break;
                case 'messages':
                    await this.loadMessages();
                    break;
                default:
                    contentBody.innerHTML = '<div style="padding: 2rem;"><p>Section not found</p></div>';
            }
        } catch (error) {
            console.error('AdminContent: Error loading section:', error);
            contentBody.innerHTML = `<div style="padding: 2rem; color: #ff4444;"><p>Error loading section: ${error.message}</p></div>`;
        }
    }

    async loadOverview() {
        console.log('AdminContent: Loading overview');
        const contentBody = document.getElementById('content-body');
        
        try {
            // Get stats
            const projectsCount = await this.getCount(this.tables.PROJECTS);
            const skillsCount = await this.getCount(this.tables.SKILLS);
            const messagesCount = await this.getCount(this.tables.MESSAGES);
            const unreadMessages = await this.getCount(this.tables.MESSAGES, { is_read: false });

            console.log('AdminContent: Stats loaded -', { projectsCount, skillsCount, messagesCount, unreadMessages });

            contentBody.innerHTML = `
                <div class="stats-grid">
                    <div class="stats-card">
                        <div class="stats-card-header">
                            <span class="stats-card-title">Total Projects</span>
                            <span class="stats-card-icon">💼</span>
                        </div>
                        <div class="stats-card-value">${projectsCount}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-card-header">
                            <span class="stats-card-title">Total Skills</span>
                            <span class="stats-card-icon">⚡</span>
                        </div>
                        <div class="stats-card-value">${skillsCount}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-card-header">
                            <span class="stats-card-title">Total Messages</span>
                            <span class="stats-card-icon">💬</span>
                        </div>
                        <div class="stats-card-value">${messagesCount}</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-card-header">
                            <span class="stats-card-title">Unread Messages</span>
                            <span class="stats-card-icon">📧</span>
                        </div>
                        <div class="stats-card-value">${unreadMessages}</div>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-card-header">
                        <h2 class="section-card-title">Quick Actions</h2>
                    </div>
                    <div style="display: flex; gap: var(--spacing-md, 1rem); flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="window.adminContent.loadSection('projects')">Add New Project</button>
                        <button class="btn btn-primary" onclick="window.adminContent.loadSection('skills')">Add New Skill</button>
                        <button class="btn btn-secondary" onclick="window.adminContent.loadSection('messages')">View Messages</button>
                        <a href="../index.html" target="_blank" class="btn btn-secondary">View Live Site</a>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-card-header">
                        <h2 class="section-card-title">Recent Messages</h2>
                    </div>
                    <div id="recent-messages">Loading messages...</div>
                </div>
            `;

            // Load recent messages
            await this.loadRecentMessages();

            // Update messages badge
            this.updateMessagesBadge(unreadMessages);
        } catch (error) {
            console.error('AdminContent: Error loading overview:', error);
            contentBody.innerHTML = `<div style="padding: 2rem; color: #ff4444;"><p>Error loading overview: ${error.message}</p></div>`;
        }
    }

    async loadRecentMessages() {
        console.log('AdminContent: Loading recent messages');
        try {
            const { data, error } = await this.supabase
                .from(this.tables.MESSAGES)
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) {
                console.error('AdminContent: Error fetching messages:', error);
                throw error;
            }

            const container = document.getElementById('recent-messages');
            if (!container) {
                console.warn('AdminContent: recent-messages container not found');
                return;
            }

            if (!data || data.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No messages yet</p></div>';
                return;
            }

            container.innerHTML = data.map(msg => `
                <div class="message-card ${!msg.is_read ? 'unread' : ''}">
                    <div class="message-header">
                        <span class="message-from">${this.sanitizeHTML(msg.name)} (${this.sanitizeHTML(msg.email)})</span>
                        <span class="message-date">${this.formatDate(msg.created_at)}</span>
                    </div>
                    <div class="message-subject">${this.sanitizeHTML(msg.subject)}</div>
                    <div class="message-body">${this.sanitizeHTML(msg.message).substring(0, 100)}...</div>
                </div>
            `).join('');

        } catch (error) {
            console.error('AdminContent: Error loading recent messages:', error);
            const container = document.getElementById('recent-messages');
            if (container) {
                container.innerHTML = `<div style="color: #ff4444;"><p>Error loading messages</p></div>`;
            }
        }
    }

    async loadAboutEditor() {
        console.log('AdminContent: Loading about editor');
        const contentBody = document.getElementById('content-body');
        
        try {
            // Get current data
            const { data, error } = await this.supabase
                .from(this.tables.ABOUT)
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('AdminContent: Error fetching about data:', error);
                throw error;
            }

            contentBody.innerHTML = `
                <div class="section-card">
                    <div class="section-card-header">
                        <h2 class="section-card-title">Edit About Section</h2>
                    </div>
                    <form id="about-form" class="admin-form">
                        <div class="form-group">
                            <label>Hero Bio</label>
                            <textarea name="hero_bio" rows="3" required>${data?.hero_bio || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>About Text (HTML allowed)</label>
                            <textarea name="about_text" rows="8" required>${data?.about_text || ''}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">SAVE CHANGES</button>
                        </div>
                    </form>
                </div>

                <div class="section-card">
                    <div class="section-card-header">
                        <h2 class="section-card-title">Edit Stats</h2>
                    </div>
                    <div id="stats-editor">Loading stats...</div>
                </div>
            `;

            // Setup form handler
            const form = document.getElementById('about-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.saveAbout(e);
                });
            }

            // Load stats editor
            await this.loadStatsEditor();
        } catch (error) {
            console.error('AdminContent: Error loading about editor:', error);
            contentBody.innerHTML = `<div style="padding: 2rem; color: #ff4444;"><p>Error loading about editor: ${error.message}</p></div>`;
        }
    }

    async saveAbout(e) {
        console.log('AdminContent: Saving about');
        const formData = new FormData(e.target);
        const data = {
            hero_bio: formData.get('hero_bio'),
            about_text: formData.get('about_text')
        };

        try {
            const { error } = await this.supabase
                .from(this.tables.ABOUT)
                .upsert(data);

            if (error) throw error;

            this.showNotification('About section updated successfully!', 'success');
        } catch (error) {
            console.error('AdminContent: Error saving about:', error);
            this.showNotification('Failed to save changes', 'error');
        }
    }

    async loadStatsEditor() {
        console.log('AdminContent: Loading stats editor');
        const container = document.getElementById('stats-editor');
        if (!container) {
            console.warn('AdminContent: stats-editor container not found');
            return;
        }

        try {
            const { data, error } = await this.supabase
                .from(this.tables.STATS)
                .select('*')
                .order('order_index');

            if (error && error.code !== 'PGRST116') {
                console.error('AdminContent: Error fetching stats:', error);
                throw error;
            }

            const stats = data && data.length > 0 ? data : [
                { key: 'projects', label: 'Projects Completed', value: 0 },
                { key: 'clients', label: 'Happy Clients', value: 0 },
                { key: 'experience', label: 'Years Experience', value: 0 }
            ];

            container.innerHTML = `
                <form id="stats-form" class="admin-form">
                    ${stats.map((stat, index) => `
                        <div class="form-row">
                            <div class="form-group">
                                <input type="text" name="stats[${index}][label]" value="${stat.label}" required>
                                <label>Label</label>
                            </div>
                            <div class="form-group">
                                <input type="number" name="stats[${index}][value]" value="${stat.value}" required>
                                <label>Value</label>
                            </div>
                            <input type="hidden" name="stats[${index}][key]" value="${stat.key}">
                        </div>
                    `).join('')}
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">SAVE STATS</button>
                    </div>
                </form>
            `;

            const form = document.getElementById('stats-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.saveStats(e);
                });
            }
        } catch (error) {
            console.error('AdminContent: Error loading stats editor:', error);
            container.innerHTML = `<div style="color: #ff4444;"><p>Error loading stats</p></div>`;
        }
    }

    async saveStats(e) {
        console.log('AdminContent: Saving stats');
        const formData = new FormData(e.target);
        const stats = [];

        // Parse form data
        for (let i = 0; formData.has(`stats[${i}][key]`); i++) {
            stats.push({
                key: formData.get(`stats[${i}][key]`),
                label: formData.get(`stats[${i}][label]`),
                value: parseInt(formData.get(`stats[${i}][value]`)),
                order_index: i
            });
        }

        try {
            // Delete existing stats and insert new ones
            await this.supabase.from(this.tables.STATS).delete().neq('key', '');
            const { error } = await this.supabase
                .from(this.tables.STATS)
                .insert(stats);

            if (error) throw error;

            this.showNotification('Stats updated successfully!', 'success');
        } catch (error) {
            console.error('AdminContent: Error saving stats:', error);
            this.showNotification('Failed to save stats', 'error');
        }
    }

    async loadProjectsManager() {
        console.log('AdminContent: Loading projects manager');
        const contentBody = document.getElementById('content-body');
        
        contentBody.innerHTML = `
            <div class="section-card">
                <div class="section-card-header">
                    <h2 class="section-card-title">Projects</h2>
                    <button class="btn btn-primary" onclick="window.adminContent.showProjectModal()">ADD NEW PROJECT</button>
                </div>
                <div id="projects-list">Loading projects...</div>
            </div>
        `;

        await this.loadProjectsList();
    }

    async loadProjectsList() {
        console.log('AdminContent: Loading projects list');
        const container = document.getElementById('projects-list');
        if (!container) {
            console.warn('AdminContent: projects-list container not found');
            return;
        }

        try {
            const { data, error } = await this.supabase
                .from(this.tables.PROJECTS)
                .select('*')
                .order('order_index');

            if (error) {
                console.error('AdminContent: Error fetching projects:', error);
                throw error;
            }

            if (!data || data.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No projects yet. Add your first project!</p></div>';
                return;
            }

            // Create table
            container.innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(project => `
                            <tr>
                                <td>${this.sanitizeHTML(project.title)}</td>
                                <td>${project.is_published ? '✅ Published' : '❌ Draft'}</td>
                                <td class="table-actions">
                                    <button class="action-btn action-btn-edit" onclick="window.adminContent.editProject(${project.id})">Edit</button>
                                    <button class="action-btn action-btn-delete" onclick="window.adminContent.deleteProject(${project.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            console.error('AdminContent: Error loading projects list:', error);
            container.innerHTML = `<div style="color: #ff4444;"><p>Error loading projects</p></div>`;
        }
    }

    showProjectModal() {
        this.showNotification('Project modal feature - implement as needed', 'info');
    }

    editProject(id) {
        console.log('AdminContent: Editing project:', id);
        this.showNotification('Edit project feature - implement as needed', 'info');
    }

    deleteProject(id) {
        console.log('AdminContent: Deleting project:', id);
        this.showNotification('Delete project feature - implement as needed', 'info');
    }

    async loadSkillsManager() {
        console.log('AdminContent: Loading skills manager');
        const contentBody = document.getElementById('content-body');
        
        contentBody.innerHTML = `
            <div class="section-card">
                <div class="section-card-header">
                    <h2 class="section-card-title">Skills</h2>
                    <button class="btn btn-primary" onclick="window.adminContent.showSkillModal()">ADD NEW SKILL</button>
                </div>
                <div id="skills-list">Loading skills...</div>
            </div>
        `;

        await this.loadSkillsList();
    }

    async loadSkillsList() {
        console.log('AdminContent: Loading skills list');
        const container = document.getElementById('skills-list');
        if (!container) {
            console.warn('AdminContent: skills-list container not found');
            return;
        }

        try {
            const { data, error } = await this.supabase
                .from(this.tables.SKILLS)
                .select('*')
                .order('order_index');

            if (error) {
                console.error('AdminContent: Error fetching skills:', error);
                throw error;
            }

            if (!data || data.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No skills yet. Add your first skill!</p></div>';
                return;
            }

            // Create table
            container.innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(skill => `
                            <tr>
                                <td>${this.sanitizeHTML(skill.name)}</td>
                                <td>${this.sanitizeHTML(skill.category || 'N/A')}</td>
                                <td>${skill.level || 'N/A'}%</td>
                                <td class="table-actions">
                                    <button class="action-btn action-btn-edit" onclick="window.adminContent.editSkill(${skill.id})">Edit</button>
                                    <button class="action-btn action-btn-delete" onclick="window.adminContent.deleteSkill(${skill.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            console.error('AdminContent: Error loading skills list:', error);
            container.innerHTML = `<div style="color: #ff4444;"><p>Error loading skills</p></div>`;
        }
    }

    showSkillModal() {
        this.showNotification('Skill modal feature - implement as needed', 'info');
    }

    editSkill(id) {
        console.log('AdminContent: Editing skill:', id);
        this.showNotification('Edit skill feature - implement as needed', 'info');
    }

    deleteSkill(id) {
        console.log('AdminContent: Deleting skill:', id);
        this.showNotification('Delete skill feature - implement as needed', 'info');
    }

    async loadContactEditor() {
        console.log('AdminContent: Loading contact editor');
        const contentBody = document.getElementById('content-body');
        
        try {
            const { data, error } = await this.supabase
                .from(this.tables.CONTACT)
                .select('*')
                .maybeSingle();

            if (error && error.code !== 'PGRST116') {
                console.error('AdminContent: Error fetching contact data:', error);
                throw error;
            }

            contentBody.innerHTML = `
                <div class="section-card">
                    <div class="section-card-header">
                        <h2 class="section-card-title">Edit Contact Information</h2>
                    </div>
                    <form id="contact-form" class="admin-form">
                        <div class="form-row">
                            <div class="form-group">
                                <input type="email" name="email" value="${data?.email || ''}" required>
                                <label>Email</label>
                            </div>
                            <div class="form-group">
                                <input type="tel" name="phone" value="${data?.phone || ''}">
                                <label>Phone</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <input type="text" name="location" value="${data?.location || ''}">
                            <label>Location</label>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">SAVE CHANGES</button>
                        </div>
                    </form>
                </div>
            `;

            const form = document.getElementById('contact-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.saveContact(e);
                });
            }
        } catch (error) {
            console.error('AdminContent: Error loading contact editor:', error);
            contentBody.innerHTML = `<div style="padding: 2rem; color: #ff4444;"><p>Error loading contact editor: ${error.message}</p></div>`;
        }
    }

    async saveContact(e) {
        console.log('AdminContent: Saving contact');
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email'),
            phone: formData.get('phone'),
            location: formData.get('location')
        };

        try {
            const { error } = await this.supabase
                .from(this.tables.CONTACT)
                .upsert(data);

            if (error) throw error;

            this.showNotification('Contact information updated successfully!', 'success');
        } catch (error) {
            console.error('AdminContent: Error saving contact:', error);
            this.showNotification('Failed to save changes', 'error');
        }
    }

    async loadMessages() {
        console.log('AdminContent: Loading messages');
        const contentBody = document.getElementById('content-body');
        
        contentBody.innerHTML = `
            <div class="section-card">
                <div class="section-card-header">
                    <h2 class="section-card-title">Messages Inbox</h2>
                </div>
                <div id="messages-list">Loading messages...</div>
            </div>
        `;

        await this.loadMessagesList();
    }

    async loadMessagesList() {
        console.log('AdminContent: Loading messages list');
        const container = document.getElementById('messages-list');
        if (!container) {
            console.warn('AdminContent: messages-list container not found');
            return;
        }

        try {
            const { data, error } = await this.supabase
                .from(this.tables.MESSAGES)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('AdminContent: Error fetching messages:', error);
                throw error;
            }

            if (!data || data.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No messages yet</p></div>';
                return;
            }

            container.innerHTML = data.map(msg => `
                <div class="message-card ${!msg.is_read ? 'unread' : ''}">
                    <div class="message-header">
                        <span class="message-from">${this.sanitizeHTML(msg.name)} (${this.sanitizeHTML(msg.email)})</span>
                        <span class="message-date">${this.formatDate(msg.created_at)}</span>
                    </div>
                    <div class="message-subject">${this.sanitizeHTML(msg.subject)}</div>
                    <div class="message-body">${this.sanitizeHTML(msg.message)}</div>
                    <div class="message-actions">
                        ${!msg.is_read ? `<button class="btn btn-primary" onclick="window.adminContent.markAsRead(${msg.id})">Mark as Read</button>` : ''}
                        <button class="btn btn-secondary" onclick="window.adminContent.deleteMessage(${msg.id})">Delete</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('AdminContent: Error loading messages list:', error);
            container.innerHTML = `<div style="color: #ff4444;"><p>Error loading messages</p></div>`;
        }
    }

    async markAsRead(id) {
        console.log('AdminContent: Marking message as read:', id);
        try {
            const { error } = await this.supabase
                .from(this.tables.MESSAGES)
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;

            await this.loadMessages();
            this.showNotification('Message marked as read', 'success');
        } catch (error) {
            console.error('AdminContent: Error marking message as read:', error);
            this.showNotification('Failed to update message', 'error');
        }
    }

    async deleteMessage(id) {
        console.log('AdminContent: Deleting message:', id);
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const { error } = await this.supabase
                .from(this.tables.MESSAGES)
                .delete()
                .eq('id', id);

            if (error) throw error;

            await this.loadMessages();
            this.showNotification('Message deleted', 'success');
        } catch (error) {
            console.error('AdminContent: Error deleting message:', error);
            this.showNotification('Failed to delete message', 'error');
        }
    }

    async getCount(table, filters = {}) {
        try {
            let query = this.supabase.from(table).select('*', { count: 'exact', head: true });
            
            Object.entries(filters).forEach(([key, value]) => {
                query = query.eq(key, value);
            });

            const { count, error } = await query;
            
            if (error) throw error;
            return count || 0;
        } catch (error) {
            console.error(`AdminContent: Error getting count for ${table}:`, error);
            return 0;
        }
    }

    updateMessagesBadge(count) {
        const badge = document.getElementById('messages-badge');
        if (!badge) return;

        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Utility functions (fallback if utils.js not available)
    sanitizeHTML(str) {
        if (!str) return '';
        if (typeof window.utils !== 'undefined' && window.utils.sanitizeHTML) {
            return window.utils.sanitizeHTML(str);
        }
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    formatDate(dateStr) {
        if (!dateStr) return '';
        if (typeof window.utils !== 'undefined' && window.utils.formatDate) {
            return window.utils.formatDate(dateStr);
        }
        const date = new Date(dateStr);
        return date.toLocaleString();
    }

    showNotification(message, type = 'info') {
        if (typeof window.utils !== 'undefined' && window.utils.showNotification) {
            window.utils.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
            alert(message);
        }
    }
}

// IMPROVED INITIALIZATION - REMOVED AUTH CHECK
function initializeAdminContent() {
    console.log('AdminContent: Attempting to initialize');
    
    // Check if already initialized
    if (window.adminContent) {
        console.log('AdminContent: Already initialized');
        return;
    }
    
    // Check if dashboard is visible (means user is logged in)
    const dashboard = document.getElementById('dashboard');
    if (!dashboard || dashboard.style.display === 'none') {
        console.log('AdminContent: Dashboard not visible, user may not be logged in');
        return;
    }
    
    // Check if dependencies are available
    if (!window.supabase) {
        console.error('AdminContent: Supabase not available');
        return;
    }
    
    if (!window.TABLES) {
        console.error('AdminContent: TABLES not available');
        return;
    }
    
    // Initialize
    console.log('AdminContent: Creating instance');
    window.adminContent = new AdminContent();
    console.log('AdminContent: Instance created successfully');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeAdminContent, 500);
    });
} else {
    setTimeout(initializeAdminContent, 500);
}

// Additional fallback
setTimeout(() => {
    if (!window.adminContent) {
        console.log('AdminContent: Trying fallback initialization');
        initializeAdminContent();
    }
}, 2000);

// Export
window.AdminContent = AdminContent;
window.initializeAdminContent = initializeAdminContent;