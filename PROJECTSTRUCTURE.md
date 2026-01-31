# 📂 Project Structure

```
portfolio/
│
├── 📄 index.html                 # Main portfolio homepage
├── 📄 README.md                  # Complete documentation
├── 📄 QUICKSTART.md             # 5-minute setup guide
├── 📄 setup.sql                 # Database setup script
│
├── 📁 css/                      # All stylesheets
│   ├── variables.css            # CSS custom properties (colors, fonts, spacing)
│   ├── reset.css                # Browser reset & base styles
│   ├── animations.css           # Animation keyframes & classes
│   ├── components.css           # Reusable UI components
│   ├── main.css                 # Main layout & section styles
│   └── responsive.css           # Mobile & tablet responsive styles
│
├── 📁 js/                       # JavaScript modules
│   ├── utils.js                 # Helper functions (debounce, storage, etc.)
│   ├── animations.js            # Animation controllers & effects
│   ├── navigation.js            # Navigation & scroll handling
│   ├── content.js               # Load content from Supabase
│   ├── form.js                  # Contact form handling
│   └── main.js                  # App initialization & main logic
│
├── 📁 admin/                    # Admin dashboard
│   ├── index.html               # Admin dashboard page
│   ├── admin.css                # Admin-specific styles
│   ├── admin-auth.js            # Authentication & login
│   ├── admin-content.js         # Content management (CRUD operations)
│   └── admin.js                 # Admin utilities
│
├── 📁 config/                   # Configuration files
│   └── supabase.js              # Supabase connection & settings
│
└── 📁 assets/                   # Static assets (create these folders)
    ├── 📁 images/               # Your images (photos, project screenshots)
    └── 📁 icons/                # Icon files
```

## 🎯 File Purposes

### Core Files

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `index.html` | Main portfolio page structure | Rarely (unless changing layout) |
| `setup.sql` | Database initialization | Once (during setup) |
| `README.md` | Full documentation | Reference only |
| `QUICKSTART.md` | Quick setup guide | Reference only |

### CSS Files (Styles)

| File | Purpose | When to Edit |
|------|---------|--------------|
| `variables.css` | Colors, fonts, spacing | ⭐ Edit to customize theme |
| `reset.css` | Browser normalization | Never |
| `animations.css` | Animation effects | Rarely |
| `components.css` | Buttons, cards, forms | Rarely |
| `main.css` | Layout & sections | Rarely |
| `responsive.css` | Mobile responsiveness | Rarely |

### JavaScript Files

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `utils.js` | Helper functions | Never |
| `animations.js` | Animation logic | Rarely (to adjust effects) |
| `navigation.js` | Navigation behavior | Rarely |
| `content.js` | Load data from database | Never |
| `form.js` | Contact form | Never |
| `main.js` | App initialization | ⭐ Edit to toggle features |

### Admin Dashboard Files

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `admin/index.html` | Admin interface | Never |
| `admin/admin.css` | Admin styling | Rarely |
| `admin/admin-auth.js` | Login system | Never |
| `admin/admin-content.js` | Content editor | Never |
| `admin/admin.js` | Admin utilities | Never |

### Configuration

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `config/supabase.js` | Database connection | ⭐ Once (add your credentials) |

## 🎨 What to Customize

### Must Edit (Before Launch)
1. ✅ `config/supabase.js` - Add your Supabase credentials
2. ✅ `index.html` - Update title and meta description
3. ✅ `css/variables.css` - Customize colors to match your brand
4. ✅ Admin Dashboard - Add your actual content (projects, skills, etc.)

### Optional Customization
- `css/variables.css` - Change fonts
- `js/main.js` - Enable/disable custom cursor
- `assets/` - Add your images and icons

### Never Edit (Unless You Know What You're Doing)
- Database loading logic (`js/content.js`)
- Authentication system (`admin/admin-auth.js`)
- Core utilities (`js/utils.js`)
- Reset styles (`css/reset.css`)

## 📋 Content Management Flow

```
User visits site (index.html)
    ↓
JavaScript loads (js/main.js)
    ↓
Connects to Supabase (config/supabase.js)
    ↓
Fetches content (js/content.js)
    ↓
Displays on page
```

```
Admin logs in (admin/index.html)
    ↓
Authenticates (admin/admin-auth.js)
    ↓
Loads dashboard (admin/admin-content.js)
    ↓
Edits content
    ↓
Saves to Supabase
    ↓
Live site updates automatically
```

## 🔧 Common Modifications

### Change Main Color
Edit `css/variables.css`:
```css
--color-primary: #00f0ff;  /* Change this */
```

### Add New Section
1. Add HTML in `index.html`
2. Add styles in `css/main.css`
3. Add navigation link in nav menu

### Disable Animations
Edit `js/main.js`:
```javascript
animationEnabled: false  // Set to false
```

### Add Social Media
Update in Admin Dashboard > Contact Info

## 🗂️ Database Tables

| Table | Stores | Managed By |
|-------|--------|------------|
| `about` | Bio & about text | Admin Dashboard |
| `projects` | Project portfolio | Admin Dashboard |
| `skills` | Technical skills | Admin Dashboard |
| `contact_info` | Contact details | Admin Dashboard |
| `messages` | Contact form submissions | Auto (from contact form) |
| `stats` | Portfolio statistics | Admin Dashboard |

## 📱 Responsive Breakpoints

- **Desktop**: > 768px (full layout)
- **Tablet**: 481px - 768px (adjusted layout)
- **Mobile**: ≤ 480px (stacked layout)

All breakpoints handled in `css/responsive.css`

## 🎯 Development Tips

1. **Test locally first**: Use local server before deploying
2. **Use browser DevTools**: Check responsive design (F12)
3. **Check console**: Look for JavaScript errors
4. **Backup database**: Export data regularly from admin
5. **Version control**: Use Git for tracking changes

## 📚 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Netlify / Vercel / GitHub Pages
- **Fonts**: Google Fonts (Orbitron, Rajdhani)

---

**This structure ensures:**
- ✅ Clean separation of concerns
- ✅ Easy maintenance
- ✅ Scalability
- ✅ Performance optimization
- ✅ Mobile-first design