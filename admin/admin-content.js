// Admin Content Management

class AdminContent {
    constructor() {
        this.supabase = window.supabase;
        this.tables = window.TABLES;
        this.currentSection = 'overview';
        this.editingProject = null;
        this.editingSkill = null;
        
        // Verify dependencies
        if (!this.supabase) {
            console.error('AdminContent: Supabase not initialized');
            return;
        }
        if (!this.tables) {
            console.error('AdminContent: TABLES not found');
            return;
        }
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadSection('overview');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Load section
                const section = item.dataset.section;
                this.loadSection(section);
            });
        });
    }

    async loadSection(section) {
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
        const contentBody = document.getElementById('content-body');
        
        try {
            // Get stats
            const projectsCount = await this.getCount(this.tables.PROJECTS);
            const skillsCount = await this.getCount(this.tables.SKILLS);
            const messagesCount = await this.getCount(this.tables.MESSAGES);
            const unreadMessages = await this.getCount(this.tables.MESSAGES, { is_read: false });

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
                        <button class="btn btn-primary" onclick="window.adminContent.loadSection('projects')">Manage Projects</button>
                        <button class="btn btn-primary" onclick="window.adminContent.loadSection('skills')">Manage Skills</button>
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
            if (!container) return;

            if (!data || data.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No messages yet</p></div>';
                return;
            }

            container.innerHTML = data.map(msg => `
                <div class="message-card ${!msg.is_read ? 'unread' : ''}">
                    <div class="message-header">
                        <span class="message-from">${this.escapeHTML(msg.name)} (${this.escapeHTML(msg.email)})</span>
                        <span class="message-date">${this.formatDate(msg.created_at)}</span>
                    </div>
                    <div class="message-subject">${this.escapeHTML(msg.subject)}</div>
                    <div class="message-body">${this.escapeHTML(msg.message).substring(0, 100)}...</div>
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
        const contentBody = document.getElementById('content-body');
        
        try {
            // Get current data - use maybeSingle for consistency
            const { data, error } = await this.supabase
                .from(this.tables.ABOUT)
                .select('*')
                .maybeSingle();

            if (error) {
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
        const btn = e.target.querySelector('button[type="submit"]');
        const formData = new FormData(e.target);
        
        // Validate
        const hero_bio = formData.get('hero_bio')?.trim();
        const about_text = formData.get('about_text')?.trim();
        
        if (!hero_bio || !about_text) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const data = { hero_bio, about_text };

        try {
            // Disable button
            btn.disabled = true;
            btn.textContent = 'SAVING...';
            
            const { error } = await this.supabase
                .from(this.tables.ABOUT)
                .upsert(data);

            if (error) throw error;

            this.showNotification('About section updated successfully!', 'success');
        } catch (error) {
            console.error('AdminContent: Error saving about:', error);
            this.showNotification('Failed to save changes', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'SAVE CHANGES';
        }
    }

    async loadStatsEditor() {
        const container = document.getElementById('stats-editor');
        if (!container) return;

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
            container.innerHTML = `<div style="color: #ff4444;"><p>Error loading stats: ${error.message}</p></div>`;
        }
    }

    async saveStats(e) {
        const btn = e.target.querySelector('button[type="submit"]');
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
            // Disable button
            btn.disabled = true;
            btn.textContent = 'SAVING...';
            
            // Use upsert with proper conflict resolution instead of delete + insert
            const { error } = await this.supabase
                .from(this.tables.STATS)
                .upsert(stats, { 
                    onConflict: 'key',
                    ignoreDuplicates: false 
                });

            if (error) throw error;

            this.showNotification('Stats updated successfully!', 'success');
        } catch (error) {
            console.error('AdminContent: Error saving stats:', error);
            this.showNotification('Failed to save stats', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'SAVE STATS';
        }
    }

    async loadProjectsManager() {
        const contentBody = document.getElementById('content-body');
        
        contentBody.innerHTML = `
            <div class="section-card">
                <div class="section-card-header">
                    <h2 class="section-card-title">Projects</h2>
                    <button class="btn btn-primary" onclick="window.adminContent.showProjectModal()">ADD NEW PROJECT</button>
                </div>
                <div id="projects-list">Loading projects...</div>
            </div>
            
            <!-- Project Modal -->
            <div id="project-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="project-modal-title">Add Project</h2>
                        <button class="modal-close" onclick="window.adminContent.closeProjectModal()">&times;</button>
                    </div>
                    <form id="project-form" class="admin-form">
                        <input type="hidden" name="id">
                        <div class="form-group">
                            <input type="text" name="title" required>
                            <label>Project Title</label>
                        </div>
                        <div class="form-group">
                            <textarea name="description" rows="4" required></textarea>
                            <label>Description</label>
                        </div>
                        <div class="form-group">
                            <input type="url" name="image_url">
                            <label>Image URL</label>
                        </div>
                        <div class="form-group">
                            <input type="url" name="project_url">
                            <label>Project URL</label>
                        </div>
                        <div class="form-group">
                            <label style="position: relative; top: 0;">
                                <input type="checkbox" name="is_published"> Published
                            </label>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">SAVE PROJECT</button>
                            <button type="button" class="btn btn-secondary" onclick="window.adminContent.closeProjectModal()">CANCEL</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        await this.loadProjectsList();
    }

    async loadProjectsList() {
        const container = document.getElementById('projects-list');
        if (!container) return;

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
                                <td>${this.escapeHTML(project.title)}</td>
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

    showProjectModal(project = null) {
        const modal = document.getElementById('project-modal');
        const form = document.getElementById('project-form');
        const title = document.getElementById('project-modal-title');
        
        if (!modal || !form) return;
        
        // Reset form
        form.reset();
        
        if (project) {
            title.textContent = 'Edit Project';
            form.elements['id'].value = project.id;
            form.elements['title'].value = project.title || '';
            form.elements['description'].value = project.description || '';
            form.elements['image_url'].value = project.image_url || '';
            form.elements['project_url'].value = project.project_url || '';
            form.elements['is_published'].checked = project.is_published || false;
        } else {
            title.textContent = 'Add Project';
        }
        
        // Setup form handler
        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.saveProject(e);
        };
        
        modal.style.display = 'flex';
    }

    closeProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) modal.style.display = 'none';
    }

    async saveProject(e) {
        const btn = e.target.querySelector('button[type="submit"]');
        const formData = new FormData(e.target);
        
        const id = formData.get('id');
        const title = formData.get('title')?.trim();
        const description = formData.get('description')?.trim();
        
        if (!title || !description) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const data = {
            title,
            description,
            image_url: formData.get('image_url')?.trim() || null,
            project_url: formData.get('project_url')?.trim() || null,
            is_published: formData.get('is_published') === 'on'
        };

        try {
            btn.disabled = true;
            btn.textContent = 'SAVING...';
            
            let error;
            if (id) {
                // Update existing
                ({ error } = await this.supabase
                    .from(this.tables.PROJECTS)
                    .update(data)
                    .eq('id', id));
            } else {
                // Insert new - get max order_index and add 1
                const { data: maxData } = await this.supabase
                    .from(this.tables.PROJECTS)
                    .select('order_index')
                    .order('order_index', { ascending: false })
                    .limit(1);
                    
                data.order_index = (maxData && maxData[0]?.order_index !== undefined) 
                    ? maxData[0].order_index + 1 
                    : 0;
                    
                ({ error } = await this.supabase
                    .from(this.tables.PROJECTS)
                    .insert(data));
            }

            if (error) throw error;

            this.showNotification('Project saved successfully!', 'success');
            this.closeProjectModal();
            await this.loadProjectsList();
        } catch (error) {
            console.error('AdminContent: Error saving project:', error);
            this.showNotification('Failed to save project', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'SAVE PROJECT';
        }
    }

    async editProject(id) {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.PROJECTS)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            this.showProjectModal(data);
        } catch (error) {
            console.error('AdminContent: Error loading project:', error);
            this.showNotification('Failed to load project', 'error');
        }
    }

    async deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const { error } = await this.supabase
                .from(this.tables.PROJECTS)
                .delete()
                .eq('id', id);

            if (error) throw error;

            this.showNotification('Project deleted successfully!', 'success');
            await this.loadProjectsList();
        } catch (error) {
            console.error('AdminContent: Error deleting project:', error);
            this.showNotification('Failed to delete project', 'error');
        }
    }

    async loadSkillsManager() {
        const contentBody = document.getElementById('content-body');
        
        contentBody.innerHTML = `
            <div class="section-card">
                <div class="section-card-header">
                    <h2 class="section-card-title">Skills</h2>
                    <button class="btn btn-primary" onclick="window.adminContent.showSkillModal()">ADD NEW SKILL</button>
                </div>
                <div id="skills-list">Loading skills...</div>
            </div>
            
            <!-- Skill Modal -->
            <div id="skill-modal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="skill-modal-title">Add Skill</h2>
                        <button class="modal-close" onclick="window.adminContent.closeSkillModal()">&times;</button>
                    </div>
                    <form id="skill-form" class="admin-form">
                        <input type="hidden" name="id">
                        <div class="form-group">
                            <input type="text" name="name" required>
                            <label>Skill Name</label>
                        </div>
                        <div class="form-group">
                            <input type="text" name="category">
                            <label>Category</label>
                        </div>
                        <div class="form-group">
                            <input type="number" name="level" min="0" max="100">
                            <label>Level (0-100)</label>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">SAVE SKILL</button>
                            <button type="button" class="btn btn-secondary" onclick="window.adminContent.closeSkillModal()">CANCEL</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        await this.loadSkillsList();
    }

    async loadSkillsList() {
        const container = document.getElementById('skills-list');
        if (!container) return;

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
                                <td>${this.escapeHTML(skill.name)}</td>
                                <td>${this.escapeHTML(skill.category || 'N/A')}</td>
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

    showSkillModal(skill = null) {
        const modal = document.getElementById('skill-modal');
        const form = document.getElementById('skill-form');
        const title = document.getElementById('skill-modal-title');
        
        if (!modal || !form) return;
        
        // Reset form
        form.reset();
        
        if (skill) {
            title.textContent = 'Edit Skill';
            form.elements['id'].value = skill.id;
            form.elements['name'].value = skill.name || '';
            form.elements['category'].value = skill.category || '';
            form.elements['level'].value = skill.level || '';
        } else {
            title.textContent = 'Add Skill';
        }
        
        // Setup form handler
        form.onsubmit = async (e) => {
            e.preventDefault();
            await this.saveSkill(e);
        };
        
        modal.style.display = 'flex';
    }

    closeSkillModal() {
        const modal = document.getElementById('skill-modal');
        if (modal) modal.style.display = 'none';
    }

    async saveSkill(e) {
        const btn = e.target.querySelector('button[type="submit"]');
        const formData = new FormData(e.target);
        
        const id = formData.get('id');
        const name = formData.get('name')?.trim();
        
        if (!name) {
            this.showNotification('Please enter a skill name', 'error');
            return;
        }
        
        const data = {
            name,
            category: formData.get('category')?.trim() || null,
            level: formData.get('level') ? parseInt(formData.get('level')) : null
        };

        try {
            btn.disabled = true;
            btn.textContent = 'SAVING...';
            
            let error;
            if (id) {
                // Update existing
                ({ error } = await this.supabase
                    .from(this.tables.SKILLS)
                    .update(data)
                    .eq('id', id));
            } else {
                // Insert new - get max order_index and add 1
                const { data: maxData } = await this.supabase
                    .from(this.tables.SKILLS)
                    .select('order_index')
                    .order('order_index', { ascending: false })
                    .limit(1);
                    
                data.order_index = (maxData && maxData[0]?.order_index !== undefined) 
                    ? maxData[0].order_index + 1 
                    : 0;
                    
                ({ error } = await this.supabase
                    .from(this.tables.SKILLS)
                    .insert(data));
            }

            if (error) throw error;

            this.showNotification('Skill saved successfully!', 'success');
            this.closeSkillModal();
            await this.loadSkillsList();
        } catch (error) {
            console.error('AdminContent: Error saving skill:', error);
            this.showNotification('Failed to save skill', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'SAVE SKILL';
        }
    }

    async editSkill(id) {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.SKILLS)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            this.showSkillModal(data);
        } catch (error) {
            console.error('AdminContent: Error loading skill:', error);
            this.showNotification('Failed to load skill', 'error');
        }
    }

    async deleteSkill(id) {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            const { error } = await this.supabase
                .from(this.tables.SKILLS)
                .delete()
                .eq('id', id);

            if (error) throw error;

            this.showNotification('Skill deleted successfully!', 'success');
            await this.loadSkillsList();
        } catch (error) {
            console.error('AdminContent: Error deleting skill:', error);
            this.showNotification('Failed to delete skill', 'error');
        }
    }

    async loadContactEditor() {
        const contentBody = document.getElementById('content-body');
        
        try {
            const { data, error } = await this.supabase
                .from(this.tables.CONTACT)
                .select('*')
                .maybeSingle();

            if (error) {
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
        const btn = e.target.querySelector('button[type="submit"]');
        const formData = new FormData(e.target);
        
        const email = formData.get('email')?.trim();
        
        if (!email) {
            this.showNotification('Email is required', 'error');
            return;
        }
        
        const data = {
            email,
            phone: formData.get('phone')?.trim() || null,
            location: formData.get('location')?.trim() || null
        };

        try {
            btn.disabled = true;
            btn.textContent = 'SAVING...';
            
            const { error } = await this.supabase
                .from(this.tables.CONTACT)
                .upsert(data);

            if (error) throw error;

            this.showNotification('Contact information updated successfully!', 'success');
        } catch (error) {
            console.error('AdminContent: Error saving contact:', error);
            this.showNotification('Failed to save changes', 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'SAVE CHANGES';
        }
    }

    async loadMessages() {
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
        const container = document.getElementById('messages-list');
        if (!container) return;

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
                <div class="message-card ${!msg.is_read ? 'unread' : ''}" data-message-id="${msg.id}">
                    <div class="message-header">
                        <span class="message-from">${this.escapeHTML(msg.name)} (${this.escapeHTML(msg.email)})</span>
                        <span class="message-date">${this.formatDate(msg.created_at)}</span>
                    </div>
                    <div class="message-subject">${this.escapeHTML(msg.subject)}</div>
                    <div class="message-body">${this.escapeHTML(msg.message)}</div>
                    <div class="message-actions">
                        ${!msg.is_read ? `<button class="btn btn-primary" data-action="mark-read" data-id="${msg.id}">Mark as Read</button>` : ''}
                        <button class="btn btn-secondary" data-action="delete" data-id="${msg.id}">Delete</button>
                    </div>
                </div>
            `).join('');

            // Add event listeners to buttons - DON'T use parseInt for UUIDs
            container.querySelectorAll('[data-action="mark-read"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id; // Keep as string for UUID
                    this.markAsRead(id);
                });
            });

            container.querySelectorAll('[data-action="delete"]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.dataset.id; // Keep as string for UUID
                    this.deleteMessage(id);
                });
            });

        } catch (error) {
            console.error('AdminContent: Error loading messages list:', error);
            container.innerHTML = `<div style="color: #ff4444;"><p>Error loading messages</p></div>`;
        }
    }

    async markAsRead(id) {
        try {
            const { error } = await this.supabase
                .from(this.tables.MESSAGES)
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;

            // Reload messages and update badge
            await this.loadMessagesList();
            const unreadCount = await this.getCount(this.tables.MESSAGES, { is_read: false });
            this.updateMessagesBadge(unreadCount);
            
            this.showNotification('Message marked as read', 'success');
        } catch (error) {
            console.error('AdminContent: Error marking message as read:', error);
            this.showNotification('Failed to update message', 'error');
        }
    }

    async deleteMessage(id) {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const { error } = await this.supabase
                .from(this.tables.MESSAGES)
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Reload messages and update badge
            await this.loadMessagesList();
            const unreadCount = await this.getCount(this.tables.MESSAGES, { is_read: false });
            this.updateMessagesBadge(unreadCount);
            
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

    // Utility functions
    escapeHTML(str) {
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

// Initialize after successful login
function initializeAdminContent() {
    // Only initialize if not already done
    if (window.adminContent) {
        return;
    }
    
    // Check if dashboard is visible (user logged in)
    const dashboard = document.getElementById('dashboard');
    if (!dashboard || dashboard.style.display === 'none') {
        return;
    }
    
    // Check dependencies
    if (!window.supabase || !window.TABLES) {
        console.error('AdminContent: Missing dependencies');
        return;
    }
    
    // Create instance
    window.adminContent = new AdminContent();
}

// Export
window.AdminContent = AdminContent;
window.initializeAdminContent = initializeAdminContent;