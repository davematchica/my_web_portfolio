// Content Loader - Fetches data from Supabase

class ContentLoader {
    constructor() {
        this.supabase = window.supabase;
        this.tables = window.TABLES;
    }

    // Load hero bio
    async loadHeroBio() {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.ABOUT)
                .select('hero_bio')
                .single();

            if (error) throw error;

            if (data && data.hero_bio) {
                const heroBioElement = document.getElementById('hero-bio');
                if (heroBioElement) {
                    heroBioElement.textContent = data.hero_bio;
                }
            }
        } catch (error) {
            console.error('Error loading hero bio:', error);
        }
    }

    // Load about section
    async loadAbout() {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.ABOUT)
                .select('*')
                .single();

            if (error) throw error;

            if (data) {
                // Update about text
                const aboutTextElement = document.getElementById('about-text');
                if (aboutTextElement && data.about_text) {
                    aboutTextElement.innerHTML = data.about_text;
                }
            }
        } catch (error) {
            console.error('Error loading about:', error);
        }
    }

    // Load stats
    async loadStats() {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.STATS)
                .select('*')
                .order('order_index');

            if (error) throw error;

            if (data && data.length > 0) {
                data.forEach(stat => {
                    const statCard = document.querySelector(`.stat-card[data-stat="${stat.key}"]`);
                    if (statCard) {
                        const numberElement = statCard.querySelector('.stat-number');
                        if (numberElement) {
                            numberElement.dataset.target = stat.value;
                            numberElement.textContent = '0';
                        }
                        const labelElement = statCard.querySelector('.stat-label');
                        if (labelElement && stat.label) {
                            labelElement.textContent = stat.label;
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    // Load projects
    async loadProjects() {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.PROJECTS)
                .select('*')
                .eq('is_published', true)
                .order('order_index');

            if (error) throw error;

            const projectsGrid = document.getElementById('projects-grid');
            if (!projectsGrid) return;

            if (!data || data.length === 0) {
                projectsGrid.innerHTML = `
                    <div class="project-placeholder">
                        <p>No projects available yet. Check back soon!</p>
                    </div>
                `;
                return;
            }

            projectsGrid.innerHTML = '';

            data.forEach((project, index) => {
                const projectCard = this.createProjectCard(project);
                projectCard.style.animationDelay = `${index * 0.1}s`;
                projectsGrid.appendChild(projectCard);
            });
        } catch (error) {
            console.error('Error loading projects:', error);
            const projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid) {
                projectsGrid.innerHTML = `
                    <div class="project-placeholder">
                        <p>Error loading projects. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';

        const tags = project.tags ? project.tags.map(tag => 
            `<span class="tag">${utils.sanitizeHTML(tag)}</span>`
        ).join('') : '';

        const liveLink = project.live_url ? 
            `<a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="project-link">Live Demo</a>` : '';
        
        const githubLink = project.github_url ? 
            `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="project-link">GitHub</a>` : '';

        card.innerHTML = `
            <div class="project-image">
                ${project.image_url ? 
                    `<img src="${project.image_url}" alt="${utils.sanitizeHTML(project.title)}" loading="lazy">` :
                    `<div style="color: var(--color-text-tertiary); font-size: var(--font-size-4xl);">💻</div>`
                }
            </div>
            <div class="project-content">
                <h3 class="project-title">${utils.sanitizeHTML(project.title)}</h3>
                <p class="project-description">${utils.sanitizeHTML(project.description)}</p>
                <div class="project-tags">${tags}</div>
                <div class="project-links">
                    ${liveLink}
                    ${githubLink}
                </div>
            </div>
        `;

        return card;
    }

    // Load skills
    async loadSkills() {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.SKILLS)
                .select('*')
                .order('order_index');

            if (error) throw error;

            const skillsGrid = document.getElementById('skills-grid');
            if (!skillsGrid) return;

            if (!data || data.length === 0) {
                skillsGrid.innerHTML = `
                    <p style="grid-column: 1 / -1; text-align: center; color: var(--color-text-tertiary);">
                        No skills data available.
                    </p>
                `;
                return;
            }

            skillsGrid.innerHTML = '';

            data.forEach((skill, index) => {
                const skillCard = this.createSkillCard(skill);
                skillCard.style.animationDelay = `${index * 0.05}s`;
                skillsGrid.appendChild(skillCard);
            });
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    }

    createSkillCard(skill) {
        const card = document.createElement('div');
        card.className = 'skill-card';

        card.innerHTML = `
            <div class="skill-icon">${skill.icon || '💻'}</div>
            <div class="skill-name">${utils.sanitizeHTML(skill.name)}</div>
            ${skill.level ? `<div class="skill-level">${utils.sanitizeHTML(skill.level)}</div>` : ''}
        `;

        return card;
    }

    // Load contact info
    async loadContactInfo() {
        try {
            const { data, error } = await this.supabase
                .from(this.tables.CONTACT)
                .select('*')
                .maybeSingle();

            if (error) throw error;

            // Get the first row if multiple exist
            const contactData = Array.isArray(data) ? data[0] : data;

            if (contactData) {
                // Update contact details
                const contactDetails = document.getElementById('contact-details');
                if (contactDetails) {
                    contactDetails.innerHTML = '';

                    if (contactData.email) {
                        contactDetails.innerHTML += `
                            <div class="contact-item">
                                <div class="contact-icon">✉️</div>
                                <div>
                                    <div style="font-weight: var(--font-weight-semibold); margin-bottom: 4px;">Email</div>
                                    <a href="mailto:${contactData.email}" style="color: var(--color-primary);">${contactData.email}</a>
                                </div>
                            </div>
                        `;
                    }

                    if (contactData.phone) {
                        contactDetails.innerHTML += `
                            <div class="contact-item">
                                <div class="contact-icon">📱</div>
                                <div>
                                    <div style="font-weight: var(--font-weight-semibold); margin-bottom: 4px;">Phone</div>
                                    <a href="tel:${contactData.phone}" style="color: var(--color-primary);">${contactData.phone}</a>
                                </div>
                            </div>
                        `;
                    }

                    if (contactData.location) {
                        contactDetails.innerHTML += `
                            <div class="contact-item">
                                <div class="contact-icon">📍</div>
                                <div>
                                    <div style="font-weight: var(--font-weight-semibold); margin-bottom: 4px;">Location</div>
                                    <span>${utils.sanitizeHTML(contactData.location)}</span>
                                </div>
                            </div>
                        `;
                    }
                }

                // Update social links
                const socialLinks = document.getElementById('social-links');
                if (socialLinks && contactData.social_links) {
                    socialLinks.innerHTML = '';
                    
                    const socialIcons = {
                        github: '🔗',
                        linkedin: '💼',
                        twitter: '🐦',
                        instagram: '📷',
                        facebook: '👤'
                    };

                    Object.entries(contactData.social_links).forEach(([platform, url]) => {
                        if (url) {
                            socialLinks.innerHTML += `
                                <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-link" title="${platform}">
                                    ${socialIcons[platform] || '🔗'}
                                </a>
                            `;
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading contact info:', error);
        }
    }

    // Load all content
    async loadAll() {
        await Promise.all([
            this.loadHeroBio(),
            this.loadAbout(),
            this.loadStats(),
            this.loadProjects(),
            this.loadSkills(),
            this.loadContactInfo()
        ]);
    }
}

// Initialize content loader
let contentLoader;
document.addEventListener('DOMContentLoaded', () => {
    contentLoader = new ContentLoader();
    contentLoader.loadAll();
});

// Export
window.ContentLoader = ContentLoader;