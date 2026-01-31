# Futuristic Portfolio Website

A modern, responsive portfolio website with an admin dashboard for non-technical content management. Built with HTML, CSS, JavaScript, and Supabase.

## 🚀 Features

### Frontend
- **Futuristic Design**: Neon cyber-themed aesthetic with smooth animations
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Loading screens, scroll reveals, and interactive elements
- **Dynamic Content**: All content loaded from Supabase database
- **Contact Form**: Integrated contact form with database storage
- **SEO Optimized**: Semantic HTML and meta tags

### Admin Dashboard
- **Secure Authentication**: Supabase authentication system
- **Easy Content Management**: Update all portfolio content without coding
- **Projects Management**: Add, edit, and delete projects
- **Skills Management**: Manage your technical skills
- **Contact Info Editor**: Update contact details and social links
- **Messages Inbox**: View and manage contact form submissions
- **Stats Dashboard**: View portfolio statistics

## 📁 Project Structure

```
portfolio/
├── index.html              # Main portfolio page
├── css/
│   ├── variables.css       # CSS custom properties
│   ├── reset.css          # CSS reset
│   ├── animations.css     # Animation keyframes
│   ├── components.css     # Reusable components
│   ├── main.css           # Main styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── utils.js           # Utility functions
│   ├── animations.js      # Animation controllers
│   ├── navigation.js      # Navigation handling
│   ├── content.js         # Content loading
│   ├── form.js            # Form handling
│   └── main.js            # Main app logic
├── admin/
│   ├── index.html         # Admin dashboard
│   ├── admin.css          # Admin styles
│   ├── admin-auth.js      # Authentication
│   ├── admin-content.js   # Content management
│   └── admin.js           # Admin utilities
├── config/
│   └── supabase.js        # Supabase configuration
└── assets/
    ├── images/            # Image files
    └── icons/             # Icon files
```

## 🛠️ Setup Instructions

### 1. Supabase Setup

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project

2. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy your `Project URL` and `anon/public key`

3. **Create Database Tables**
   - Go to SQL Editor in Supabase
   - Run the SQL script provided in `setup.sql` file

4. **Enable Authentication**
   - Go to Authentication > Settings
   - Enable Email authentication
   - Create your admin user account

### 2. Configure the Project

1. **Update Supabase Configuration**
   - Open `config/supabase.js`
   - Replace `YOUR_SUPABASE_URL` with your Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your anon key

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. Deploy

You can deploy this portfolio to:

#### **Netlify** (Recommended)
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy (automatic)

#### **Vercel**
1. Push your code to GitHub
2. Import project to Vercel
3. Deploy

#### **GitHub Pages**
1. Push to GitHub
2. Enable GitHub Pages in repository settings
3. Select main branch

## 📊 Database Schema

### Tables

#### `about`
- `id` (uuid, primary key)
- `hero_bio` (text)
- `about_text` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `projects`
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `image_url` (text)
- `live_url` (text)
- `github_url` (text)
- `tags` (text[])
- `is_published` (boolean)
- `order_index` (integer)
- `created_at` (timestamp)

#### `skills`
- `id` (uuid, primary key)
- `name` (text)
- `icon` (text)
- `level` (text)
- `order_index` (integer)
- `created_at` (timestamp)

#### `contact_info`
- `id` (uuid, primary key)
- `email` (text)
- `phone` (text)
- `location` (text)
- `social_links` (jsonb)
- `updated_at` (timestamp)

#### `messages`
- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `subject` (text)
- `message` (text)
- `is_read` (boolean)
- `created_at` (timestamp)

#### `stats`
- `id` (uuid, primary key)
- `key` (text, unique)
- `label` (text)
- `value` (integer)
- `order_index` (integer)

## 🎨 Customization

### Colors
Edit `css/variables.css` to change the color scheme:
```css
--color-primary: #00f0ff;      /* Main accent color */
--color-secondary: #ff00ff;    /* Secondary accent */
--color-accent: #00ff88;       /* Tertiary accent */
```

### Fonts
Current fonts: Orbitron (headings) & Rajdhani (body)
Change in `index.html` and `css/variables.css`

### Animations
Enable/disable custom cursor in `js/main.js`:
```javascript
customCursorEnabled: false  // Set to true to enable
```

## 🔐 Admin Dashboard

Access the admin dashboard at `/admin/index.html`

### Default Login
You'll need to create your admin account in Supabase Authentication.

### Features
- **Overview**: View statistics and recent messages
- **About**: Edit hero bio and about section
- **Projects**: Add, edit, delete projects
- **Skills**: Manage your skills
- **Contact**: Update contact information
- **Messages**: View contact form submissions

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## ⚡ Performance

- Optimized CSS and JavaScript
- Lazy loading for images
- Minimal dependencies
- Fast page load times

## 🐛 Troubleshooting

### Content not loading?
1. Check Supabase credentials in `config/supabase.js`
2. Verify database tables are created
3. Check browser console for errors

### Can't login to admin?
1. Verify authentication is enabled in Supabase
2. Create an account in Supabase Authentication
3. Check email/password are correct

### Animations not working?
1. Check if JavaScript is enabled
2. Try disabling browser extensions
3. Clear browser cache

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions:
- Check the documentation
- Review the code comments
- Contact the developer

## 🎯 Future Enhancements

Potential features to add:
- [ ] Blog section
- [ ] Dark/Light mode toggle
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Image upload to Supabase Storage
- [ ] Advanced project filtering
- [ ] Testimonials section

## 👨‍💻 Development

To run locally:
1. Clone the repository
2. Update Supabase credentials
3. Open `index.html` in a browser
4. Or use a local server: `python -m http.server 8000`

## 📝 Notes

- Replace placeholder content with your own
- Add your own images to `assets/images/`
- Customize colors and fonts to match your brand
- Test on multiple devices and browsers
- Keep Supabase credentials secure
- Regular backups recommended

---

Built with ❤️ using HTML, CSS, JavaScript & Supabase