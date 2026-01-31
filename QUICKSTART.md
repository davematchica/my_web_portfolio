# 🚀 Quick Start Guide

Get your portfolio website up and running in 5 minutes!

## Step 1: Supabase Setup (2 minutes)

1. **Create Account**
   - Go to https://supabase.com
   - Sign up for free account
   - Create a new project

2. **Run SQL Setup**
   - Open SQL Editor in Supabase dashboard
   - Copy contents of `setup.sql`
   - Paste and run the script
   - Wait for confirmation message

3. **Create Admin Account**
   - Go to Authentication section
   - Click "Add user"
   - Enter your email and password
   - Confirm the user

4. **Get Credentials**
   - Go to Settings > API
   - Copy your `Project URL`
   - Copy your `anon public` key

## Step 2: Configure Project (1 minute)

1. **Update Supabase Config**
   - Open `config/supabase.js`
   - Replace these lines:
   
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';  // ← Paste your URL here
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';  // ← Paste your key here
```

2. **Save the file**

## Step 3: Test Locally (1 minute)

### Option A: Simple (Double-click)
- Open `index.html` in your browser

### Option B: Local Server (Recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server)
npx http-server -p 8000
```

Then open: http://localhost:8000

## Step 4: Test Admin Dashboard (1 minute)

1. Open http://localhost:8000/admin/index.html
2. Login with your Supabase credentials
3. Edit content and see changes!

## Step 5: Deploy (FREE Options)

### Netlify (Easiest)
1. Push code to GitHub
2. Go to https://netlify.com
3. Click "New site from Git"
4. Select your repository
5. Click "Deploy site"
6. Done! 🎉

### Vercel
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Deploy automatically

### GitHub Pages
1. Push to GitHub
2. Go to repository Settings
3. Enable GitHub Pages
4. Select main branch
5. Your site is live!

## 🎨 Customize Your Portfolio

### Update Content
1. Go to `/admin/`
2. Login
3. Edit:
   - About section
   - Projects
   - Skills
   - Contact info

### Update Colors
Edit `css/variables.css`:
```css
--color-primary: #00f0ff;    /* Change to your color */
--color-secondary: #ff00ff;
--color-accent: #00ff88;
```

### Add Your Photo
1. Save image to `assets/images/`
2. Update in admin dashboard or database

## 📝 Sample Data

The setup includes sample data to help you get started:
- 3 sample projects
- 8 sample skills
- Contact information template
- About section template

**Remember to update this with your own information!**

## 🆘 Common Issues

### "Content not loading"
- Check Supabase credentials in `config/supabase.js`
- Verify SQL script ran successfully
- Check browser console (F12) for errors

### "Can't login to admin"
- Make sure you created a user in Supabase Authentication
- Check email/password are correct
- Clear browser cache

### "Animations not smooth"
- Try a different browser
- Check if hardware acceleration is enabled
- Reduce animations in `js/main.js`

## 🎯 Next Steps

1. ✅ Update all sample content with your own
2. ✅ Add your projects
3. ✅ Upload your photo
4. ✅ Customize colors to match your brand
5. ✅ Add your social media links
6. ✅ Test on mobile devices
7. ✅ Deploy to production
8. ✅ Share with the world!

## 💡 Pro Tips

- **Test on multiple devices**: Use browser dev tools
- **Optimize images**: Use compressed images for faster loading
- **SEO**: Update meta tags in `index.html`
- **Backup**: Export your data regularly from admin
- **Security**: Never commit Supabase credentials to public repos

## 🤝 Need Help?

- Read the full `README.md`
- Check the code comments
- Review Supabase documentation
- Contact support

---

**Congratulations! Your portfolio is ready! 🎉**

Now go create something amazing! 💪