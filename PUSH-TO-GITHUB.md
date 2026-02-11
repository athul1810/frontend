# Push to GitHub - Quick Guide

## 🚀 Quick Push Commands

Open Terminal and run these commands:

```bash
cd ~/Desktop/backend-team-website

# Remove existing .git if corrupted (optional)
rm -rf .git

# Initialize git
git init

# Add remote repository
git remote add origin https://github.com/athul1810/frontend.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: AutoEdit AI website with modern design, login page, and pricing page"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## 📋 What's Included

- ✅ Modern homepage with video editing interface
- ✅ Login page (Google-style desktop layout)
- ✅ Pricing page with 4 tiers
- ✅ Smooth animations and transitions
- ✅ Responsive design
- ✅ All CSS and JavaScript files

## 🔗 Repository

https://github.com/athul1810/frontend

## ⚠️ Note

If you get authentication errors, you may need to:
1. Set up GitHub credentials: `git config --global user.name "Your Name"`
2. Set up GitHub email: `git config --global user.email "your.email@example.com"`
3. Use a personal access token instead of password when pushing
